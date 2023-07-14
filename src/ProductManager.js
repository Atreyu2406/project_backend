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

/*
product.addProduct("Harry Potter", "Película Fantasía", 6500, "harry.jpg", "AAA001", 12)
product.addProduct("Harry Potter 2", "Película Fantasía", 7200, "harry.jpg", "AAA002", 1)
product.addProduct("Harry Potter 3", "Película Fantasía", 4500, "harry.jpg", "AAA003", 7)
product.addProduct("Harry Potter 4", "Película Fantasía", 5555, "harry.jpg", "AAA004", 24)
product.addProduct("Harry Potter 5", "Película Fantasía", 9850, "harry.jpg", "AAA005", 8)
*/