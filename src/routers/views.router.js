import { Router } from "express";
import productModel from "../dao/models/product.model.js";
import cartModel from "../dao/models/cart.model.js";
import { getProducts } from "./products.router.js";
import { getProductsFromCart } from "./carts.router.js";
// import { ProductManager } from "../dao/fsManagers/ProductManager.js";

const router = Router()
// const product = new ProductManager()

router.get("/", async(req, res) => {
    const result = await getProducts(req, res)
    if(result.statusCode === 200) {
        res.render("home", { products: result.response.payload, paginateInfo: {
            hasPrevPage: result.response.hasPrevPage,
            hasNextPage: result.response.hasNextPage,
            prevLink: result.response.prevLink,
            nextLink: result.response.nextLink,
            }
        })
    } else {
        res.status(result.statusCode).json({ status: "error", error: result.response.error})
    }
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

router.get("/carts/:cid", async(req, res) => {
    const result = await getProductsFromCart(req, res)
    if(result.statusCode === 200) {
        res.render("productsFromToCart", { cart: result.response.payload })
    } else {
        res.status(result.statusCode).json({ status: "error", error: result.response.error })
    }
    // try {
    //     const id = req.params.cid
    //     const result = await cartModel.findById(id).lean().exec()
    //     if(result === null) {
    //         return res.status(404).json({ status: "error", error: "Not found" })
    //     }
    //     // res.status(200).json({ status: "success", payload: result })
    //     res.render("carts", { cid: result._id, products: result.products })
    // } catch(err) {
    //     res.status(500).json({ status: "error", error: err.message })
    // }
})

export default router