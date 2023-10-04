import { Schema, model } from "mongoose";

const cartsColl = 'carts';

const productSchema = new Schema({
    product: { type: Schema.Types.ObjectId, ref: 'products' },
    quantity: Number,
});

const cartsSchema = new Schema({
    id: Number,
    products: [productSchema],
});

const CartModel = model(cartsColl, cartsSchema);

export default CartModel;
