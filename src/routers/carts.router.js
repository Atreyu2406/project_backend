import { Router } from "express";
import cartModel from "../dao/models/cart.model.js"
import productModel from "../dao/models/product.model.js";
import { CartManager } from "../dao/fsManagers/CartManager.js";

const router = Router()

const cart = new CartManager()
const fileContent = await cart.getCarts()

router.get("/", async(req, res) => {
    try {
        const limit = req.query.limit || 0
        const result = await cartModel.find().limit(limit).lean().exec()
        res.status(200).json({ status: "success", payload: result})
    } catch(err) {
        res.status(500).json({ status: "error", error: err.message })
    }
    // let limit = req.query.limit
    // if (limit > fileContent.length) return res.status(400).json ({ error: "Limit not valid"})
    // res.status(200).json({ payload: fileContent.slice(0, limit) })
})

router.get("/:cid", async(req, res) => {
    try {
        const id = req.params.cid
        const result = await cartModel.findById(id)
        if(result === null) return res.status(404).json({ status: "error", error: "Not found"})
        res.status(200).json({ status: "success", payload: result})
    } catch(err) {
        res.status(500).json({ status: "error", error: err.message })
    }
    // let id = req.params.cid
    // let result = await cart.getCartById(id)
    // if(typeof result == "string") return res.status(400).json({ status: "error", error: result })
    // res.status(200).json({ status: "successful", payload: result })
})

router.post("/", async(req, res) => {
    try {
        const result = await cartModel.create({})
        res.status(200).json({ status: "success", payload: result})
    } catch(err){
        res.status(500).json({ status: "error", error: err.message })
    }
    // let result = await cart.addCarts()
    // // if(typeof result == "string") return res.status(400).json({ status: "error", error: result })
    // res.status(200).json({ status: "successful", payload: result })
})

router.post("/:cid/product/:pid", async(req, res) => {
    try {
        const cid = req.params.cid
        const pid = req.params.pid

        const cartToUpdate = await cartModel.findById(cid)
        if(cartToUpdate === null) return res.status(404).json({ status: "error", error: `Cart with id=${cid} not found`})

        const productToAdd = await productModel.findById(pid)
        if(productToAdd === null) return res.status(404).json({ status: "error", error: `Product with id=${pid} not found`})

        const productIndex = cartToUpdate.products.findIndex(item => item.product == pid)
        if(productIndex > -1) cartToUpdate.products[productIndex].quantity += 1
        cartToUpdate.products.push({ product: pid, quantity: 1 })

        const result = await cartModel.findByIdAndUpdate(cid, cartToUpdate, { returnDocument: "after" })
        res.status(201).json({ status: "success", payload: result })
    } catch(err) {
        res.status(500).json({ status: "error", error: err.message })
    }
    // let cartId = req.params.cid
    // let productId = req.params.pid
    // let result = await cart.addProductInCart(cartId, productId)
    // if(typeof result == "string") return res.status(400).json({ status: "error", error: result })
    // res.status(200).json({ status: "successful", payload: result })
})

// router.put("/:cid", async(req, res) => {
//     try {
//         const cid = req.params.cid
//         const cartToUpdate = await cartModel.findById(cid)
//         if(cartToUpdate === null) return res.status(404).json({ status: "error", error: `Cart with id=${cid} not found`})
//         const products = req.body.products
//         //start: validaciones del array enviado por body
//         if(!products) return res.status(400).json({ status: "error", error: `Field "products" is not optional` })
//         for (let i = 0; i < products.lenght; i++) {
//             if (!products[i].hasOwnProperty("products") || !products[i].hasOwnProperty("quantity")) {
//                 return res.status(400).json({ status: "error", error: "Product must have a valid ID anda a valid QUANTITY" })
//             }
//             if(typeof products[i].quantity !== "number") {
//                 return res.status(400).json({ status: "error", error: "Product QUANTITY must be a number" })
//             }
//             if (products.quantity === 0) {
//                 return res.status(400).json({ status: "error", error: `Product QUANTITY cannot be 0`})
//             }
//             const productIndex = cartToUpdate.products.findIndex(item => item.product == pid)
//             if(productIndex === -1) return res.status(400).json({ status: "error", error: `Product with id=${pid} not found in Cart with id=${cid}` })
//             cartToUpdate.products[productIndex].quantity = quantity
//         }
//         //end: validaciones de quantity enviado por body
//         const result = await cartModel.findByIdAndUpdate(cid, cartToUpdate, { returnDocument: "after" })
//         res.status(200).json({ status: "success", payload: result })
//     } catch(err) {
//         res.status(500).json({ status: "error", error: err.message })
//     }
// })

export default router