class ProductManager {
    constructor() {
        this.products = []
    }

    generateId = () => (this.products.length === 0) ? 1 : this.products[this.products.length - 1].id + 1

    getProducts = () => this.products

    addProduct = (title, description, price, thumbnail, code, stock)  => {
        if(!title || !description || !price || !thumbnail || !code || !stock) return console.log("Fields are missing")
        let foundCode = this.products.find(item => item.code === code)
        if(foundCode) return console.log("The code exists")
        this.products.push({ id: this.generateId(), title, description, price, thumbnail, code, stock })
    }

    getProductById = (id) => {
        let result = this.products.find(item => item.id === id)
        if(!result) return "Product Not Found"
        return result
    }
}

const product = new ProductManager()

product.addProduct("Harry Potter", "Peli de fantasía", 11500, "Harry.jpg", "AAA001", 12)
product.addProduct("Peli de fantasía", 11500, "Harry.jpg", "AAA001", 12)
product.addProduct("Indiana Jones", "Peli de fantasía", 11500, "Harry.jpg", "AAA001", 12)

console.log(product.getProducts())