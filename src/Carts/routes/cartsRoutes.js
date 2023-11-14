import express from 'express';
import Cart from '../models/cartModel.js';
import Product from '../models/productModel.js';

const router = express.Router();

router.post('/:cid/purchase', async (req, res) => {
    try {
        const cartId = req.params.cid;
        const cart = await Cart.findById(cartId).populate('products.productId');

        if (!cart) {
            return res.status(404).json({ error: 'Carrito no encontrado' });
        }

        for (const item of cart.products) {
            const product = item.productId;
            const requestedQuantity = item.quantity;

            if (product.stock >= requestedQuantity) {
                product.stock -= requestedQuantity;
            } else {
                return res.status(400).json({ error: `Producto '${product.name}' no tiene suficiente stock` });
            }
        }

        const updatePromises = cart.products.map((item) =>
            Product.findByIdAndUpdate(item.productId._id, { stock: item.productId.stock })
        );

        await Promise.all(updatePromises);

        cart.products = [];
        await cart.save();

        return res.json({ message: 'Compra exitosa' });
    } catch (error) {
        console.error('Error al finalizar la compra:', error);
        return res.status(500).json({ error: 'Error interno al finalizar la compra' });
    }
});

export default router;
