import { Router } from 'express';
import path from 'path';
import fs from 'fs';

const router = Router();

const __dirname = path.resolve();

const rutaProduct = path.join(__dirname, 'files', 'products.json');
const rutaCarts = path.join(__dirname, 'files', 'carts.json');

async function getProducts() {
    try {
        const data = await fs.promises.readFile(rutaProduct, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        return [];
    }
}

async function getCarts() {
    try {
        const data = await fs.promises.readFile(rutaCarts, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        return [];
    }
}

async function saveCarts(carts) {
    try {
        await fs.promises.writeFile(rutaCarts, JSON.stringify(carts, null, 5));
    } catch (error) {
        throw new Error('Error al guardar los carritos');
    }
}

router.post('/', async (req, res) => {
    try {
        let carts = await getCarts();

        const newCart = {
            id: carts.length > 0 ? carts[carts.length - 1].id + 1 : 1,
            products: []
        };

        carts.push(newCart);
        await saveCarts(carts);

        res.status(201).json({ newCart });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/:cid', async (req, res) => {
    try {
        const cartId = parseInt(req.params.cid);
        const carts = await getCarts();

        const cart = carts.find(cart => cart.id === cartId);

        if (cart) {
            res.json(cart.products);
        } else {
            res.status(404).json({ error: 'Cart not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/:cid/product/:pid', async (req, res) => {
    try {
        const cartId = parseInt(req.params.cid);
        const productId = parseInt(req.params.pid);
        const { quantity } = req.body;

        const products = await getProducts();
        const carts = await getCarts();

        const cartIndex = carts.findIndex(cart => cart.id === cartId);
        const product = products.find(product => product.id === productId);

        if (cartIndex !== -1 && product) {
            const cart = carts[cartIndex];
            const existingProduct = cart.products.find(item => item.product === productId);

            if (existingProduct) {
                existingProduct.quantity += quantity || 1;
            } else {
                cart.products.push({ product: productId, quantity: quantity || 1 });
            }

            await saveCarts(carts);
            res.status(200).json({ updatedCart: cart });
        } else {
            res.status(404).json({ error: 'Cart or product not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
