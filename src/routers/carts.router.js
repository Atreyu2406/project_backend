import { Router } from "express";
import cartModel from "../dao/models/cart.model.js"
import productModel from "../dao/models/product.model.js";
import { CartManager } from "../dao/fsManagers/CartManager.js";
import { get } from "mongoose";

const router = Router()

const cart = new CartManager()
const fileContent = await cart.getCarts()
export const getProductsFromCart = async(req, res) => {
    try {
        const id = req.params.cid
        const result = await cartModel.findById(id).populate("products.product").lean()
        if (result === null) {
            return {
                statusCode: 404,
                response: { status: "error", error: "Not found" }
            }
        }
        return {
            statusCode: 200,
            response: { status: "success", payload: result }
        }
    } catch(err) {
        return {
            statusCode: 500,
            response: { status: "error", error: err.message }
        }
    }
}


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
    const result = await getProductsFromCart(req, res)
    res.status(result.statusCode).json(result.response)
    // try {
    //     const id = req.params.cid
    //     const result = await cartModel.findById(id).populate("products.product").lean()
    //     if(result === null) return res.status(404).json({ status: "error", error: "Not found"})
    //     res.status(200).json({ status: "success", payload: result})
    // } catch(err) {
    //     res.status(500).json({ status: "error", error: err.message })
    // }

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
        if(productIndex > -1) {
            cartToUpdate.products[productIndex].quantity += 1
        } else {
            cartToUpdate.products.push({ product: pid, quantity: 1 })
        }
        
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

router.put("/:cid", async(req, res) => {
    try{
        const id = req.params.cid
        const cartToUpdate = await cartModel.findById(cid)
        if(cartToUpdate === null) return res.status(404).json({ status: "error", error: `Cart width ID=${id} not found`})

        const products = req.body.products

        //start: validaciones del array enviado por body
        if(!products) {
            return res.status(400).json({ status: "error", error: `Fields "products" is not optional` })
        }
        for(let i = 0; i < products.length; i++) {
            if(!products[i].hasOwnProperty("product") || !products[i].hasOwnProperty("quantity")) {
                return res.status(400).json({ status: "error", error: `products must have a valid ID and a valid QUANTITY` })
            }
            if(typeof products[i].quantity !== "number") {
                return res.status(400).json({ status: "error", error: `product quantity must be a number` })
            }
            const productToAdd = await productModel.findById(products[i].product)
            if (productToAdd === null) {
                return res.satuts(400).json({ status: "error", error: `Product with ID=${products[i].product} does not exists` })
            }
        }
        //end: validaciones del array enviado por body

        cartToUpdate.products = products
        const result = await cartModel.findByIdAndUpdate(cid, cartToUpdate, { returnDocument: "after" })
        res.status(200).json({ status: "success", payload: result })
    } catch(err){
        res.status(500).json({ status: "error", error: err.message })
    }
})

router.put("/:cid/product/:pid", async(req, res) => {
    try {
        const cid = req.params.cid
        const pid = req.params.pid

        const cartToUpdate = await cartModel.findById(cid)
        if(cartToUpdate === null) return res.status(404).json({ status: "error", error: `Cart width ID=${cid} not found`})

        const productToUpdate = await productModel.findById(pid)
        if(productToUpdate === null) return res.status(404).json({ status: "error", error: `Product width ID=${pid} not found`})
        
        const quantity = req.body.quantity

        //start:validaciones de quantity eviado por body
        if(!quantity) {
            return res.status(400).json({ status: "error", error: `Field "quantity" is not optional` })
        }
        if(typeof quantity !== "number") {
            return res.status(400).json({ status: "error", error: `product quantity must be a number` })
        }
        if(quantity === 0) {
            return res.status(400).json({ status: "error", error: `product quantity cannot be 0` })
        }
        const productIndex = cartToUpdate.products.findIndex(item => item.product == pid)
        if(productIndex === -1) {
            return res.status(400).json({ status: "error", error: `Product with ID=${pid} not found in Cart with ID=${cid}`})
        } else {
            cartToUpdate.products[productIndex].quantity = quantity
        }
        //end: validaciones de quantity enviado por body

        const result = await cartModel.findByIdAndUpdate(cid, cartToUpdate, { returnDocument: "after" })
        res.status(200).json({ status: "success", payload: result })
    } catch(err) {
        res.status(500).json({ status: "error", error: err.message })
    }
})

router.delete("/:cid", async(req, res) => {
    try{
        const id = req.params.cid
        const cartToUpdate = await cartModel.findById(id)
        if(cartToUpdate === null) return res.status(404).json({ status: "error", error: `Cart width ID=${id} not found`})
        cartToUpdate.products = []
        const result = await cartModel.findByIdAndUpdate(id, cartToUpdate, { returnDocument: "after" })
        res.status(200).json({ status: "success", payload: result })
    } catch(err){
        res.status(500).json({ status: "error", error: err.message })
    }
})

router.delete("/:cid/product/:pid", async(req, res) => {
    try{
        const cid = req.params.cid
        const pid = req.params.pid

        const cartToUpdate = await cartModel.findById(cid)
        if(cartToUpdate === null) return res.status(404).json({ status: "error", error: `Cart width ID=${cid} not found`}) 

        const productToDelete = await productModel.findById(pid)
        if(productToDelete === null) return res.status(404).json({ status: "error", error: `Product width ID=${pid} not found`}) 

        const productIndex = cartToUpdate.products.findIndex(item => item.product == pid)
        if(productIndex < 0) return res.status(400).json({ status: "error", error: `Product with ID=${pid} not found in Cart with ID=${cid}`})
        cartFilter = cartToUpdate.products.filter(item => item.product.toString() !== pid)
        const result = await cartModel.findByIdAndUpdate(cid, cartFilter, ({ returnDocument: "after "}))

    } catch(err){

    }
})

export default router