import { Router } from "express";
import userModel from "../dao/models/user.model.js";
import { createHash, isValidPassword } from "../utils.js"

const router = Router()

//View to register users
router.get("/register", (req, res) => {
    res.render("sessions/register")
})

//API to create users in the database
router.post("/register", async(req, res) => {
    const userNew = {
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        age: req.body.age,
        email: req.body.email,
        password: createHash(req.body.password)
    }
    const user = new userModel(userNew)
    await user.save()
    res.redirect("/session/login")
})

//View to login
router.get("/login", (req, res) => {
    res.render("sessions/login")
})

//API to login
router.post("/login", async(req, res) => {
    const { email, password } = req.body
    const user = await userModel.findOne({ email }).lean().exec()
    if(!user) return res.status(401).json({ status: "error", error: "User not found" })
    if(!isValidPassword(user, password)) return res.status(403).json({ status: "error", error: "Password incorrect" })
    req.session.user = user
    res.redirect("/products")
})

//Close session
router.get("/logout", (req, res) => {
    req.session.destroy(err => {
        if(err) res.status(500).json({ status: "error", error: err.message })
        res.redirect("/session/login")
    })
})

// const auth = (req, res, next) => {
//     if(req.session?.user && req.session.user.username === "admin@cogerhouse.com") return next()
//     return res.status(401).json({ status: "fail", message: "Auth error" })
// }

// router.get("/profile", (req, res) => {
//     const user = {
//         username: "damianmonti",
//         ui_preference: "dark",
//         language: "es",
//         location: "arg"
//     }
//     req.session.user = user
//     res.json({ status: "success", message: "session created" })
// })

// router.get("/preference", (req, res) => {
//     res.send(req.session.user.username)
// })

// router.get("/delete", (req, res) => {
//     req.session.destroy(err => {
//         if(err) return res.json({ status: "error", message: "An error occurred" })
//         return res.json({ status: "success", message: "Session deleted" })
//     })
// })

export default router
