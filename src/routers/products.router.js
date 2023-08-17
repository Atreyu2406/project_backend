import { Router } from "express";
import productModel from "../dao/models/product.model.js";
// import { ProductManager } from "../dao/fsManagers/ProductManager.js";

const router = Router()

export const getProducts = async(req, res) => {
    try {
        const limit = req.query.limit || 1
        const page = req.query.page || 1

        const filterOptions = {}
        if(req.query.stock) filterOptions.stock = req.query.stock
        if(req.query.category) filterOptions.category = req.query.category

        const paginateOptions = { limit, page }
        if (req.query.sort === "asc") paginateOptions.sort = { price: 1 }
        if (req.query.sort === "desc") paginateOptions.sort = { price: -1 }

        const result = await productModel.paginate({}, { page, limit, lean: true }, paginateOptions, filterOptions)

        let prevLink
        if(!req.query.page) {
            prevLink = `http://${req.hostname}:8080${req.originalUrl}?page=${result.prevPage}`
        } else {
            const modifiedUrl = req.originalUrl.replace(`page=${req.query.page}`, `page=${result.prevPage}`)
            prevLink = `http://${req.hostname}:8080${modifiedUrl}`
        }

        let nextLink
        if(!req.query.page) {
            nextLink = `http://${req.hostname}:8080${req.originalUrl}?page=${result.nextPage}`
        } else {
            const modifiedUrl = req.originalUrl.replace(`page=${req.query.page}`, `page=${result.nextPage}`)
            nextLink = `http://${req.hostname}:8080${modifiedUrl}`
        }

        return {
            statusCode: 200,
            response: {
                status: "success",
                payload: result.docs,
                prevPages: result.prevPage,
                nextPages: result.nextPage,
                page: result.page,
                hasPrevPage: result.hasPrevPage,
                hasNextPage: result.hasNextPage,
                prevLink: result.hasPrevPage ? prevLink : null,
                nextLink: result.hasNextPage ? nextLink : null
            }
        }
    } catch(err) {
        return {
            statusCode: 500,
            response: { status: "error", error: err.message }
        }
    }
}
// const product = new ProductManager()
// const fileContent = await product.getProducts()

router.get("/", async(req, res) => {
    const result = await getProducts(req, res)
    res.status(result.statusCode).json(result.response)
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
        const result = await productModel.findByIdAndDelete(id)
        if(result === null) return res.status(404).json({ status: "error", error: "Not Found" })
        const products = await productModel.find().lean().exec()
        req.io.emit("updatedProducts", products)
        res.status(200).json({ status: "success", payload: result })
    } catch(err){
        res.status(500).json({ status: "error", error: err.message })
    }
    // let id = req.params.pid
    // let result = await product.deleteProduct(id)
    // req.io.emit("updatedProducts", fileContent)
    // res.status(200).json({ status: "successful", payload: result })
})
  
export default router

