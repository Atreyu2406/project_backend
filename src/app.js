import express from "express"
import session from "express-session"
import MongoStore from "connect-mongo"
import cors from "cors"
import handlebars from "express-handlebars"
import { Server } from "socket.io"
import productsRouter from "./routers/products.router.js"
import cartsRouter from "./routers/carts.router.js"
import viewsRouter from "./routers/views.router.js"
import chatRouter from "./routers/chat.router.js"
import sessionRouter from "./routers/session.router.js"
import mongoose from "mongoose"
import messageModel from "./dao/models/message.model.js"
import __dirname from "./utils.js"

const app = express()
app.use(cors())

//template engine configuration
app.engine("handlebars", handlebars.engine())
app.set("views", __dirname + "/views")
app.set("view engine", "handlebars")

app.use(express.static(__dirname + "/public"))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// app.get("/", (req, res) => {
//     res.status(200).json({ message: "Server OK" })
// })

const MONGO_URI = "mongodb+srv://atreyu2406:benja2012@cluster0.2dskaxd.mongodb.net"
const MONGO_DB_NAME = "ecommerce"

//session configuration
app.use(session({
    store: MongoStore.create({
        mongoUrl: MONGO_URI,
        dbName: MONGO_DB_NAME,
        mongoOptions: {
            useNewUrlParser: true,
            useUnifiedTopology: true
        }
    }),
    secret: "victoriasecret",
    resave: true,
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

app.use("/api/products", productsRouter)
app.use("/api/carts", cartsRouter)
app.use("/products", viewsRouter)
app.use("/chat", chatRouter)
app.use("/session", sessionRouter)

const messages = []

io.on("connection", socket => {
    console.log("A connection has been made")
    socket.broadcast.emit("alert")
    socket.emit("logs", messages)
    socket.on("message", async data => {
        await messageModel.create(data)
        let messages = await messageModel.find().lean().exec()
        // messages.push(data)
        io.emit("logs", messages)
    })
    socket.on("productList", data => {
        console.log("Product list received on the server:", data);
        io.emit("updatedProducts", data)
    })
})




