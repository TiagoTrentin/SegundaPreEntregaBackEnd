import { Router } from "express";
import { cartModel } from '../models/cart.model.js';
import { productsModel } from "../models/products.model.js";

const router = Router();

router.post('/', async (req, res) => {
    try {
        const lastCart = await cartModel.findOne({}, {}, { sort: { id: -1 } });
        const nextId = (lastCart ? lastCart.id : 0) + 1;

        const newCart = await cartModel.create({
            id: nextId,
            products: []
        });

        await newCart.save();

        res.status(201).json({ message: 'Carrito creado con éxito', cart: newCart });
    } catch (error) {
        res.status(500).json({ error: 'Error inesperado', detalle: error.message });
    }
});

router.get('/:cid', async (req, res) => {
    try {
        const cart = await cartModel.findOne({ id: parseInt(req.params.cid) }).populate('products.product');

        if (!cart) {
            return res.status(404).json({ error: 'Carrito no encontrado' });
        }

        res.status(200).json({ message: 'Carrito encontrado', cart });
    } catch (error) {
        res.status(500).json({ error: 'Error inesperado', detalle: error.message });
    }
});

router.post('/:cid/product/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params;

        const cart = await cartModel.findOne({ id: parseInt(cid) });
        const product = await productsModel.findOne({ id: parseInt(pid) });

        if (!cart || !product) {
            return res.status(404).json({ error: 'Carrito o producto no encontrado' });
        }

        const existingProduct = cart.products.find(item => item.product.toString() === product._id.toString());

        if (existingProduct) {
            existingProduct.quantity += 1;
        } else {
            cart.products.push({ product: product._id, quantity: 1 });
        }

        await cart.save();

        const updatedCart = await cartModel.findOne({ id: parseInt(cid) });

        res.status(200).json({ message: 'Producto agregado al carrito con éxito', updatedCart });
    } catch (error) {
        res.status(500).json({ error: 'Error inesperado', detalle: error.message });
    }
});

export default router;
