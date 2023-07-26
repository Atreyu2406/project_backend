import { Router } from "express";
import messageModel from "../dao/models/message.model.js";

const router = Router()

router.get("/", (req, res) => {
    res.render("chat")
})

export default router