import { Server } from 'socket.io';
import express from 'express';
import http from 'http';

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const port = 8080;

class ProductManager {
    constructor() {
        this.products = [];
        this.path = "";
    }

    setPath(path) {
        this.path = path;
    }

    addProduct(title, description, price, thumbnail, code, category, stock, id, status) {
        let newProduct = {
            title,
            description,
            price,
            thumbnail,
            code,
            stock,
            category,
            id,
            status,
            path: this.path,
        };

        this.products.push(newProduct);
    }

    getProducts() {
        return this.products;
    }

    getProductById(id) {
        return this.products.find(product => product.id === id);
    }

    updateProductById(id, updatedFields) {
        const productIndex = this.products.findIndex(product => product.id === id);

        if (productIndex !== -1) {
            this.products[productIndex] = {
                ...this.products[productIndex],
                ...updatedFields
            };
            return true;
        }

        return false;
    }

    deleteProductById(id) {
        const productIndex = this.products.findIndex(product => product.id === id);

        if (productIndex !== -1) {
            this.products.splice(productIndex, 1);
            return true;
        }

        return false;
    }
}

let pm = new ProductManager();
pm.setPath("/products");

let autos = [
    {
        "marca": "BMW",
        "modelo": "M330",
        "color": "Gris Plata",
        "kilometraje": "42320",
        "precio": "$12.000.000,00",
        "año": "2020",
        "category": "deportivo",
        "id": 1,
    },
    {
        "marca": "Cadillac",
        "modelo": "CT5",
        "color": "Negro",
        "kilometraje": "12045",
        "precio": "$18.000.000,00",
        "año": "2022",
        "category": "deportivo",
        "id": 2,
    },
    {
        "marca": "Dodge",
        "modelo": "Charger",
        "color": "Blanco",
        "kilometraje": "87320",
        "precio": "$10.000.000,00",
        "año": "2014",
        "category": "deportivo",
        "id": 3,
    },
    {
        "marca": "GMC",
        "modelo": "Sierra",
        "color": "Azul",
        "kilometraje": "23371",
        "precio": "$24.000.000,00",
        "año": "2023",
        "category": "camioneta",
        "id": 4,
    }
];

autos.forEach(auto => {
    pm.addProduct(auto.marca, `${auto.modelo} / Año= ${auto.año} / Color = ${auto.color} / Km = ${auto.kilometraje}km`, auto.precio, "", auto.id, auto.category, auto.stock);
});

app.use(express.json());

app.get('/:pid', (req, res) => {
    const productId = parseInt(req.params.pid);
    const foundProduct = pm.getProductById(productId);

    if (foundProduct) {
        res.json(foundProduct);
    } else {
        res.status(404).json({ error: 'Producto no encontrado' });
    }
});

app.post('/', (req, res) => {
    const { id, title, description, code, price, status, stock, category, thumbnails } = req.body;

    if (id && title && description && code && price !== undefined && status !== undefined && stock !== undefined && category && thumbnails) {
        pm.addProduct(title, description, price, thumbnails, code, category, stock, id, status);
        res.status(201).json({ message: 'Producto agregado exitosamente' });
    } else {
        res.status(400).json({ error: 'Campos inválidos en la solicitud' });
    }
});

app.put('/:pid', (req, res) => {
    const productId = parseInt(req.params.pid);
    const { title, description, code, price, status, stock, category, thumbnails } = req.body;

    if (title && description && code && price !== undefined && status !== undefined && stock !== undefined && category && thumbnails) {
        const updatedFields = {
            title,
            description,
            code,
            price,
            status,
            stock,
            category,
            thumbnails,
        };

        const updated = pm.updateProductById(productId, updatedFields);

        if (updated) {
            res.json({ message: 'Producto actualizado exitosamente' });
        } else {
            res.status(404).json({ error: 'Producto no encontrado' });
        }
    } else {
        res.status(400).json({ error: 'Campos inválidos en la solicitud' });
    }
});

server.listen(port, () => {
    console.log(`Servidor en funcionamiento en http://localhost:${port}`);
});

io.on('connection', (socket) => {
    console.log(`Se ha conectado un cliente con id ${socket.id}`);

    socket.emit('bienvenida', { message: 'Bienvenido al servidor' });

    socket.on("identificacion", nombre => {
        console.log(`Se ha conectado ${nombre}`);
        socket.emit('idCorrecto', { message: `Hola ${nombre}. Bienvenido` });
    });
});

app.get('/autos', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(autos);
});

app.post('/autos', (req, res) => {
    let nuevosAutos = req.body;

    autos.push(...nuevosAutos);
    io.emit('nuevoAuto', nuevosAutos, autos);
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(autos);
});
