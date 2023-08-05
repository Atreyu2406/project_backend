import { Router } from "express";

const router = Router()

router.get("/profile", (req, res) => {
    const user = {
        username: "damianmonti",
        ui_preference: "dark",
        language: "es",
        location: "arg"
    }
    req.session.user = user
    res.json({ status: "success", message: "session created" })
})

router.get("/preference", (req, res) => {
    res.send(req.session.user.username)
})

router.get("/delete", (req, res) => {
    req.session.destroy(err => {
        if(err) return res.json({ status: "error", message: "An error occurred" })
        return res.json({ status: "success", message: "Session deleted" })
    })
})

export default router
