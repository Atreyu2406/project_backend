import express from "express"
import session from "express-session"
import cors from "cors"
import handlebars from "express-handlebars"
import { Server } from "socket.io"
import productsRouter from "./routers/products.router.js"
import cartsRouter from "./routers/carts.router.js"
import viewsRouter from "./routers/views.router.js"
import chatRouter from "./routers/chat.router.js"
import userRouter from "./routers/user.router.js"
import mongoose from "mongoose"

const app = express()
app.use(cors())

//template engine configuration
app.engine("handlebars", handlebars.engine())
app.set("views", "./src/views")
app.set("view engine", "handlebars")

app.use(express.json())

// app.get("/", (req, res) => {
//     res.status(200).json({ message: "Server OK" })
// })

//session configuration
app.use(session({
    secret: "victoriasecret",
    resave: false,
    saveUninitialized: true
}))

//mongoose configuration
try {
    await mongoose.connect("mongodb+srv://atreyu2406:benja2012@cluster0.2dskaxd.mongodb.net/ecommerce");
    console.log("Connected to MongoDB Atlas successfully!");
} catch(err) {
    console.error("Error connecting to MongoDB Atlas:", err.message);
}

//socket.io configuration
const serverHttp = app.listen(8080, () => console.log("Server Up..."))
const io = new Server(serverHttp)
app.use((req, res, next) => {
    req.io = io
    next()
})

app.use("/", express.static("./src/public"))
app.use("/api/products", productsRouter)
app.use("/api/carts", cartsRouter)
app.use("/products", viewsRouter)
app.use("/chat", chatRouter)
app.use("/user", userRouter)

const messages = []

io.on("connection", socket => {
    console.log("A connection has been made")
    socket.broadcast.emit("alert")
    socket.emit("logs", messages)
    socket.on("message", data => {
        messages.push(data)
        io.emit("logs", messages)
    })
    socket.on("productList", data => {
        console.log("Product list received on the server:", data);
        io.emit("updatedProducts", data)
    })
})




