const express = require('express');
const app = express();
const port = 8080;

class CartManager {
    constructor() {
        this.carts = [];
    }

    addProductToCart(cartId, productId, quantity) {
        const cart = this.carts.find(cart => cart.id === cartId);

        if (cart) {
            const newProduct = { product: productId, quantity };
            cart.products.push(newProduct);
            return true;
        }

        return false;
    }
}

let cm = new CartManager();

let carts = [
    {
        "id": 1,
        "products": []
    },
    {
        "id": 2,
        "products": []
    },
    {
        "id": 3,
        "products": []
    },
    {
        "id": 4,
        "products": []
    },
    {
        "id": 5,
        "products": []
    }
];

carts.forEach(cart => {
    cm.addCart(cart.id, cart.products);
});

app.use(express.json());

app.post('/cart/:cid/product/:pid', (req, res) => {
    const cartId = parseInt(req.params.cid);
    const productId = parseInt(req.params.pid);
    const { quantity } = req.body;

    if (quantity !== undefined) {
        const added = cm.addProductToCart(cartId, productId, quantity);

        if (added) {
            res.json({ message: 'Producto agregado al carrito exitosamente' });
        } else {
            res.status(404).json({ error: 'Carrito no encontrado' });
        }
    } else {
        res.status(400).json({ error: 'Falta la cantidad en la solicitud' });
    }
});

app.listen(port, () => {
    console.log(`Servidor en funcionamiento en http://localhost:${port}`);
});
