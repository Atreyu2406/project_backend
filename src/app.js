import express from "express"

const users = [
    {id: 1, name: "Damian", age: 40},
    {id: 2, name: "Benja", age: 10},
    {id: 3, name: "Ori", age: 3},
    {id: 4, name: "Denu", age: 30}
]

const cursos = [
    {id: 1, teacher: "Damian", name: "Backend"},
    {id: 2, teacher: "Benja", name: "Logic"},
]

const app = express()
app.use(express.json())

app.get("/", (req, res) => {
    res.status(200).json({ message: "Server OK" })
})

app.get("/users", (req, res) => {
    let limit = req.query.limit
    if (limit > users.length) return res.status(400).json ({ error: "Limit not valid"})
    res.status(200).json({ users: users.slice(0, limit) })
})

app.get("/cursos", (req, res) => {
    res.status(200).json({ cursos })
})

app.post("/users", (req, res) => {
    let { id, name, age } = req.body
    if(!id || !name || !age) return res.status(400).json({ error: "Same fields are missing"})
    let userCreated = { id: parseInt(id), name, age: parseInt(age) }
    users.push(userCreated)
    res.status(201).json({ message: "User created", payload: userCreated})
})

app.put("/users/:id", (req, res) => {
    let id = req.params.id
    let newData = req.body
    let user = users.find(item => item.id == id)
    let userIndex = users.findIndex(item => item.id == id)
    users[userIndex] = {
        ...user,
        ...newData
    }
    res.status(200).json({ status: "User update" })
})

app.delete("/users/:id", (req, res) => {
    let id = req.params.id
    let result = users.filter(item => item.id != id)
    res.status(200).json({ message: "User deleted", payload: result})
})

app.listen(8080, () => console.log("Server Up..."))