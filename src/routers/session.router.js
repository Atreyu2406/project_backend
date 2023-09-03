import { Router } from "express";
import passport from "passport";

const router = Router()

//View to register with GitHub
router.get("/github", passport.authenticate("github", { scope: ["user:email"] }), async(req, res) => {
})

//View to GitHub Callback
router.get("/githubcb", passport.authenticate("github", { failureRedirect: "/login" }), async(req, res) => {
    console.log("Callback: ", req.user)
    req.session.user = req.user
    res.redirect("/")
})

//View to register users
router.get("/register", (req, res) => {
    res.render("sessions/register")
})

//API to create users in the database
router.post("/register", passport.authenticate("register", {
    failureRedirect: "/session/failRegister"
}), async(req, res) => {
    // const userNew = {
    //     first_name: req.body.first_name,
    //     last_name: req.body.last_name,
    //     age: req.body.age,
    //     email: req.body.email,
    //     password: createHash(req.body.password)
    // }
    // const user = new userModel(userNew)
    // await user.save()
    res.redirect("/session/login")
})

//View to failRegister
router.get("/failRegister", (req, res) => {
    res.json({ status: "error", error: "Failed register"})
})

//View to login
router.get("/login", (req, res) => {
    res.render("sessions/login")
})

//API to login
router.post("/login", passport.authenticate("login", { failureRedirect: "/session/failLogin" }), async(req, res) => {
    // const { email, password } = req.body
    // const user = await userModel.findOne({ email }).lean().exec()
    // if(!user) return res.status(401).json({ status: "error", error: "User not found" })
    // if(!isValidPassword(user, password)) return res.status(403).json({ status: "error", error: "Password incorrect" })
    // req.session.user = user
    res.redirect("/products")
})

//View to failLogin
router.get("/failLogin", (req, res) => {
    res.json({ status: "error", error: "Failed login"})
})

//Close session
router.get("/logout", (req, res) => {
    req.session.destroy(err => {
        if(err) res.status(500).json({ status: "error", error: err.message })
        res.redirect("/session/login")
    })
})

//Current
router.get("/current", (req, res) => {
    if(!req.session.user) return res.status(401).json({ status: "error", error: "No session detected" })
    res.status(200).json({ status: "success", payload: req.session.user })
})

// const auth = (req, res, next) => {
//     if(req.session?.user && req.session.user.username === "admin@cogerhouse.com") return next()
//     return res.status(401).json({ status: "fail", message: "Auth error" })
// }

export default router
