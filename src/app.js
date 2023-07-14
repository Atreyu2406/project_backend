import express from "express"
import { ProductManager } from "./ProductManager.js"

const product = new ProductManager()
const fileContent = await product.getProducts()

const app = express()
app.use(express.json())

app.get("/", (req, res) => {
    res.status(200).json({ message: "Server OK" })
})

app.get("/products", async(req, res) => {
    let limit = req.query.limit
    if (limit > fileContent.length) return res.status(400).json ({ error: "Limit not valid"})
    res.status(200).json({ payload: fileContent.slice(0, limit) })
})

app.get("/products/:pid", async(req, res) => {
    let id = req.params.pid
    let result = fileContent.find(item => item.id == id)
    if(!result) return res.status(400).json({ error: "ID not found" })
    res.status(200).json({ status: "successful", payload: result })
})
// app.post("/users", (req, res) => {
//     let { id, name, age } = req.body
//     if(!id || !name || !age) return res.status(400).json({ error: "Same fields are missing"})
//     let userCreated = { id: parseInt(id), name, age: parseInt(age) }
//     users.push(userCreated)
//     res.status(201).json({ message: "User created", payload: userCreated})
// })

// app.put("/users/:id", (req, res) => {
//     let id = req.params.id
//     let newData = req.body
//     let user = users.find(item => item.id == id)
//     let userIndex = users.findIndex(item => item.id == id)
//     users[userIndex] = {
//         ...user,
//         ...newData
//     }
//     res.status(200).json({ status: "User update" })
// })

// app.delete("/users/:id", (req, res) => {
//     let id = req.params.id
//     let result = users.filter(item => item.id != id)
//     res.status(200).json({ message: "User deleted", payload: result})
// })



app.listen(8080, () => console.log("Server Up..."))