import fs from "fs"
class ProductManager {
    constructor() {
        this.path = "./src/products.json"
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

    addProduct = async(title, description, price, thumbnail, code, stock)  => {
        let products = await this.getProducts()
        if(!title || !description || !price || !thumbnail || !code || !stock) return console.log("Fields are missing")
        let foundCode = products.find(item => item.code === code)
        if(foundCode) return console.log("The code exists")
        const newId = await this.generateId()
        products.push({ id: newId, title, description, price, thumbnail, code, stock })
        await fs.promises.writeFile(this.path, JSON.stringify(products, null, "\t"))
    }

    getProductById = async(id) => {
        let products = await this.getProducts()
        let result = products.find(item => item.id === id)
        if(!result) return console.log("Product Not Found")
        return result
    }

    deleteProduct = async(id) => {
        let products = await this.getProducts()
        let result = products.filter(item => item.id !== id)
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

