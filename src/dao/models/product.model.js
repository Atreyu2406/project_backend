import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2"

const productSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    code: { type: String, unique: true, required: true },
    status: { type: Boolean, default: true },
    stock: { type: Number, required: true},
    thumbnails: { type: [String], default: [] },
    category: { type: String, required: true }
})

productSchema.plugin(mongoosePaginate)
mongoose.set("strictQuery", false)
const productModel = mongoose.model("products", productSchema)

export default productModel