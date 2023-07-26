import fs from "fs"
import { ProductManager } from "./ProductManager.js"
import { parse } from "path"

const product = new ProductManager

export class CartManager {
    constructor() {
        this.path = "./carts.json"
        this.format = "utf-8"
        this.init()
    }

    init = async() => {
        if(!fs.existsSync(this.path)) {
            await fs.promises.writeFile(this.path, JSON.stringify([], null, "\t"))
        }
    }

    generateId = async() => {
        let carts = await this.getCarts()
        return (carts.length === 0) ? 1 : carts[carts.length - 1].id + 1
    }

    getCarts = async() => {
        const fileContent = await fs.promises.readFile(this.path, this.format)
        return JSON.parse(fileContent)
    }

    getCartById = async(id) => {
        if(!fs.existsSync(this.path)) return `[ERR] DB File does not exists.`
        let carts = await this.getCarts()
        let result = carts.find(item => item.id == id)
        if(!result) return "[ERR] Not Found"
        return result
    }

    addCarts = async()  => {
        if(!fs.existsSync(this.path)) return `[ERR] DB File does not exists.`
        let carts = await this.getCarts()
        // if(!product.title || !product.description || !product.price || !product.code || !product.stock) return "[ERR] Fields are missing"
        // let foundCode = products.find(item => item.code === product.code)
        // if(foundCode) return "[ERR] The code exists"
        const newId = await this.generateId()
        carts.push({ id: parseInt(newId), products: [] })
        await fs.promises.writeFile(this.path, JSON.stringify(carts, null, "\t"))
        return carts
    }

    addProductInCart = async(cartId, productId) => {
        //probar con getCartById
        // let cartsById = await this.getCartById(cartId)
        // if(typeof cartsById == "string") return `[ERR] Cart with ID = ${cartId} was not found`
        let carts = await this.getCarts()
        let cartsById = carts.find(item => item.id == cartId)
        if(!cartsById) return "Cart not found"
        let products = await product.getProducts()
        let productsById = products.find(item => item.id == productId)
        if(!productsById) return "Product not found"

        let cartsAll = await this.getCarts()
        let cartFilter = cartsAll.filter(item => item.id != cartId)
        if(cartsById.products.some(item => item.id == productId)) {
            let moreProductInCart = cartsById.products.find(item => item.id == productId)
            moreProductInCart.quantity++
            let result = [cartsById, ...cartFilter]
            await fs.promises.writeFile(this.path, JSON.stringify(result, null, "\t"))
        } else {
            cartsById.products.push({ id: productsById.id, quantity: 1 })
            let result = [cartsById, ...cartFilter]
            await fs.promises.writeFile(this.path, JSON.stringify(result, null, "\t"))
        }
    }
}

