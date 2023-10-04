import { Schema, model } from "mongoose";
import mongoosePaginate from 'mongoose-paginate-v2';

const productsColl = 'products';

const productsSchema = new Schema({
    id: Number,
    title: String,
    description: String,
    code: String,
    price: Number,
    status: Boolean,
    thumbnail: String,
    stock: Number,
    category: String
});

productsSchema.plugin(mongoosePaginate);

const ProductsModel = model(productsColl, productsSchema);

export default ProductsModel;
