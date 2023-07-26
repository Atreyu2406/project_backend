import { Router } from "express";
import productModel from "../dao/models/product.model.js";
// import { ProductManager } from "../dao/fsManagers/ProductManager.js";

const router = Router()
// const product = new ProductManager()

router.get("/", async(req, res) => {
    try {
        let page = parseInt(req.query.page) || 1
        let limit = parseInt(req.query.limit) || 3
        const products = await productModel.paginate({}, { page, limit, lean: true })
        products.prevLink = products.hasPrevPage ? `/products?page=${products.prevPage}` : ""
        products.nextLink = products.hasNextPage ? `/products?page=${products.nextPage}` : ""
        res.render("home", { products })
    } catch(err) {
        res.status(500).json({ status: "error", error: err.message })
    }
    // let fileContent = await product.getProducts()
    // res.render("home", { fileContent })
})

router.get("/realTimeProducts", async(req, res) => {
    try {
        const products = await productModel.find().lean().exec()
        res.render("realTimeProducts", { products })
    } catch(err) {
        res.status(500).json({ status: "error", error: err.message })
    }
    // let fileContent = await product.getProducts()
    // res.render("realTimeProducts", { fileContent })
})



export default router