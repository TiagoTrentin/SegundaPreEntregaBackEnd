import express from 'express';
import { isAdmin, isUser } from './models'; 
import Product from '../models/productModel.js';
import Cart from '../models/cartModel.js';
import Product from '../models/productModel.js';


const router = express.Router();

export const createProduct = async (req, res) => {
    try {
        const { marca, modelo, color, kilometraje, precio, año, category } = req.body;

        if (!marca || !modelo || !color || !kilometraje || !precio || !año || !category) {
            return res.status(400).json({ error: 'Todos los campos son obligatorios.' });
        }

        const newProduct = new Product({
            marca,
            modelo,
            color,
            kilometraje,
            precio,
            año,
            category,
            id: Math.floor(Math.random() * 1000)
        });

        const savedProduct = await newProduct.save();

        res.status(201).json(savedProduct);
    } catch (error) {
        console.error('Error al crear un nuevo producto:', error);
        res.status(500).json({ error: 'Error interno al crear un nuevo producto.' });
    }
};


export const updateProduct = async (req, res) => {
    try {
        const productId = req.params.productId;

        const existingProduct = await Product.findById(productId);

        if (!existingProduct) {
            return res.status(404).json({ error: 'Producto no encontrado.' });
        }

        const { marca, modelo, color, kilometraje, precio, año, category } = req.body;

        if (marca) existingProduct.marca = marca;
        if (modelo) existingProduct.modelo = modelo;
        if (color) existingProduct.color = color;
        if (kilometraje) existingProduct.kilometraje = kilometraje;
        if (precio) existingProduct.precio = precio;
        if (año) existingProduct.año = año;
        if (category) existingProduct.category = category;

        const updatedProduct = await existingProduct.save();

        res.json(updatedProduct);
    } catch (error) {
        console.error('Error al actualizar el producto:', error);
        res.status(500).json({ error: 'Error interno al actualizar el producto.' });
    }
};

import Product from '../models/productModel.js';
export const deleteProduct = async (req, res) => {
    try {
        const productId = req.params.productId;

        const existingProduct = await Product.findById(productId);

        if (!existingProduct) {
            return res.status(404).json({ error: 'Producto no encontrado.' });
        }

        await existingProduct.remove();

        res.json({ message: 'Producto eliminado correctamente.' });
    } catch (error) {
        console.error('Error al eliminar el producto:', error);
        res.status(500).json({ error: 'Error interno al eliminar el producto.' });
    }
};


export const sendMessage = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ error: 'Usuario no autenticado.' });
        }

        const { message } = req.body;

        if (!message) {
            return res.status(400).json({ error: 'El campo de mensaje es obligatorio.' });
        }

        res.json({ message: 'Mensaje enviado correctamente.' });
    } catch (error) {
        console.error('Error al enviar el mensaje al chat:', error);
        res.status(500).json({ error: 'Error interno al enviar el mensaje al chat.' });
    }
};

export const addToCart = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ error: 'Usuario no autenticado.' });
        }

        const { productId, quantity } = req.body;

        if (!productId || !quantity || quantity <= 0) {
            return res.status(400).json({ error: 'ID de producto y cantidad válida son obligatorios.' });
        }

        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({ error: 'Producto no encontrado.' });
        }

        let userCart = await Cart.findOne({ user: req.user._id });

        if (!userCart) {
            userCart = new Cart({ user: req.user._id, products: [] });
        }

        const existingProduct = userCart.products.find((item) => item.productId.equals(productId));

        if (existingProduct) {
            existingProduct.quantity += quantity;
        } else {
            userCart.products.push({ productId, quantity });
        }

        const updatedCart = await userCart.save();

        res.json(updatedCart);
    } catch (error) {
        console.error('Error al agregar productos al carrito:', error);
        res.status(500).json({ error: 'Error interno al agregar productos al carrito.' });
    }
};
