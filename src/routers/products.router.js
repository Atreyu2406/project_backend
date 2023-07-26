import { Router } from "express";
import productModel from "../dao/models/product.model.js";
// import { ProductManager } from "../dao/fsManagers/ProductManager.js";

const router = Router()

// const product = new ProductManager()
// const fileContent = await product.getProducts()

router.get("/", async(req, res) => {
    try {
        const limit = req.query.limit || 0
        const result = await productModel.find().limit(limit).lean().exec()
        res.status(200).json({ status: "success", payload: result})
    } catch(err) {
        res.status(500).json({ status: "error", error: err.message })
    }
    // let limit = req.query.limit
    // if (limit > fileContent.length) return res.status(400).json ({ error: "Limit not valid"})
    // res.status(200).json({ payload: fileContent.slice(0, limit) })
})

router.get("/:pid", async(req, res) => {
    try {
        const id = req.params.pid
        const result = await productModel.findById(id).lean().exec()
        if(result === null) return res.status(404).json({ status: "error", error: "Not Found"})
        res.status(200).json({ status: "success", payload: result})
    } catch(err){
        res.status(500).json({ status: "error", error: err.message })
    }
    // let id = req.params.pid
    // let result = await product.getProductById(id)
    // if(typeof result == "string") return res.status(400).json({ status: "error", error: result })
    // res.status(200).json({ status: "successful", payload: result })
})

router.post("/", async(req, res) => {
    try {
        const product = req.body
        const result = await productModel.create(product)
        const products = await productModel.find().lean().exec()
        req.io.emit("updatedProducts", products)
        res.status(200).json({ status: "success", payload: result})
    } catch(err){
        res.status(500).json({ status: "error", error: err.message })
    }
    // let newProduct = req.body
    // let result = await product.addProduct(newProduct)
    // if(typeof result == "string") return res.status(400).json({ status: "error", error: result })
    // req.io.emit("updatedProducts", fileContent)
    // res.status(200).json({ status: "successful", payload: result })
})

router.put("/:pid", async (req, res) => {
    try {
        const id = req.params.pid
        const newProduct = req.body
        //findByIdAndUpdate updates but returns previous data
        const result = await productModel.findByIdAndUpdate(id, newProduct, { returnDocument: "after" })
        if(result === null) return res.status(404).json({ status: "error", error: "Not Found"})
        const products = await productModel.find().lean().exec()
        req.io.emit("updatedProducts", products)
        res.status(200).json({ status: "success", payload: result})
    } catch(err){
        res.status(500).json({ status: "error", error: err.message })
    }
    // let id = req.params.pid
    // let newData = req.body
    // let result = await product.updateProduct({ id: id, ...newData });
    // req.io.emit("updatedProducts", fileContent)
    // res.status(200).json({ status: "successful", payload: result });
});

router.delete("/:pid", async(req, res) => {
    try {
        const id = req.params.pid
        result = await productModel.findByIdAndDelete(id)
        if(result === null) return res.status(404).json({ status: "error", error: "Not Found"})
        const products = await productModel.find().lean().exec()
        req.io.emit("updatedProducts", products)
        res.status(200).json({ status: "success", payload: result})
    } catch(err){
        res.status(500).json({ status: "error", error: err.message })
    }
    // let id = req.params.pid
    // let result = await product.deleteProduct(id)
    // req.io.emit("updatedProducts", fileContent)
    // res.status(200).json({ status: "successful", payload: result })
})
  
export default router

