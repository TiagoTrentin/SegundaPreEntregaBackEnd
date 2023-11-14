// models/productModel.js
import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    stock: { type: Number, required: true },
    price: { type: Number, required: true },
    sales: { type: Number, default: 0 },
});

const Product = mongoose.model('Product', productSchema);
export default Product;
