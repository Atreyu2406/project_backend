import fs from "fs"
export class ProductManager {
    constructor() {
        this.path = "./products.json"
        this.format = "utf-8"
    }
    
    generateId = async() => {
        let products = await this.getProducts()
        return (products.length === 0) ? 1 : products[products.length - 1].id + 1
    }

    getProducts = async() => {
        const fileContent = await fs.promises.readFile(this.path, this.format)
        return JSON.parse(fileContent)
      }

    addProduct = async(product)  => {
        let products = await this.getProducts()
        if(!product.title || !product.description || !product.price || !product.code || !product.stock) return "[ERR] Fields are missing"
        let foundCode = products.find(item => item.code === product.code)
        if(foundCode) return "[ERR] The code exists"
        const newId = await this.generateId()
        products.push({ id: newId, status: true, thumbnails: [], ...product })
        await fs.promises.writeFile(this.path, JSON.stringify(products, null, "\t"))
        return products
    }

    getProductById = async(id) => {
        let products = await this.getProducts()
        let result = products.find(item => item.id == id)
        if(!result) return "Product Not Found"
        return result
    }

    deleteProduct = async(id) => {
        let products = await this.getProducts()
        let result = products.filter(item => item.id != id)
        if(result.length === products.length) return "ID not found"
        await fs.promises.writeFile(this.path, JSON.stringify(result, null, "\t"))
        return "Product delete seccessfully"
    }

    updateProduct = async({id, ...product}) => {
        await this.deleteProduct(id)
        let products = await this.getProducts()
        let result = [{ id, ...product }, ...products]
        await fs.promises.writeFile(this.path, JSON.stringify(result, null, "\t"))
        return "Product Updated"
    } 
}

const product = new ProductManager()

