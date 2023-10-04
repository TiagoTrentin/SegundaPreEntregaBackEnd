import { Router } from 'express';
import { serverSocket } from "../../../app.js";
import { productsModel } from '../models/products.model.js';

const router = Router();

router.get('/', async (req, res) => {
    try {
        const { limit = 10, page = 1, sort, query } = req.query;

        const options = {
            page: parseInt(page),
            limit: parseInt(limit),
            sort: sort === 'desc' ? { price: -1 } : { price: 1 },
        };

        const filter = query ? { category: query } : {};

        const products = await productsModel.paginate(filter, options);

        const responseData = {
            products: products.docs,
            totalPages: products.totalPages,
            hasPrevPage: products.hasPrevPage,
            hasNextPage: products.hasNextPage,
            prevPage: products.prevPage,
            nextPage: products.nextPage,
        };

        res.status(200).json(responseData);
    } catch (error) {
        res.status(500).json({ error: 'Error al buscar productos.' });
    }
});

router.get('/:pid', async (req, res) => {
    try {
        const product = await productsModel.findOne({ id: req.params.pid });

        if (!product) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        res.json(product);
    } catch (error) {
        res.status(500).json({ error: 'Error inesperado', detalle: error.message });
    }
});

router.post('/', async (req, res) => {
    try {
        const lastProduct = await productsModel.findOne({}, {}, { sort: { id: -1 } });
        const lastId = lastProduct ? lastProduct.id : 0;
        const nextId = lastId + 1;

        const newProductData = { id: nextId, ...req.body };
        const newProduct = await productsModel.create(newProductData);
        await newProduct.save();

        const products = await productsModel.find();

        serverSocket.emit('newProduct', newProduct, products);

        res.status(201).json({ message: 'Producto creado con éxito', product: newProduct });

    } catch (error) {
        res.status(500).json({ error: 'Error inesperado', detalle: error.message });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const productId = parseInt(req.params.id);

        const productToUpdate = await productsModel.findOne({ id: productId });

        if (!productToUpdate) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        Object.assign(productToUpdate, req.body);
        await productToUpdate.save();

        res.status(200).json({ message: 'Producto modificado con éxito', product: productToUpdate });

    } catch (error) {
        res.status(500).json({ error: 'Error inesperado', detalle: error.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const productId = parseInt(req.params.id);
        const productToDelete = await productsModel.findOneAndRemove({ id: productId });

        if (!productToDelete) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        const products = await productsModel.find();

        serverSocket.emit('productDeleted', { productId, products });

        res.status(200).json({ message: 'Producto eliminado con éxito', product: productToDelete });

    } catch (error) {
        res.status(500).json({ error: 'Error inesperado', detalle: error.message });
    }
});

export default router;
