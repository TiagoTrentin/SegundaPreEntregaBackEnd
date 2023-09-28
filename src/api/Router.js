const { Router } = require('express');
const router = Router();
const Container = require('../conteiner');
const archivo = 'products.json';
const containerProducts = new Container();
const multer = require('multer');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, __dirname + '');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

router.use(multer({ storage }).single('foto'));

router.get('/', (req, res) => {
    res.json(containerProducts.getAll(archivo));
});

router.get('/:id', (req, res) => {
    const { id } = req.params;
    const product = containerProducts.getById(parseInt(id), archivo);
    product ? res.json({ product_id: id, producto: product })
        : res.json({ mensaje: 'Producto no encontrado ' + id });
});

router.post('/', (req, res) => {
    const body = req.body;
    const photo = req.file;
    body.thumbnail = photo.filename;
    containerProducts.saveProduct(body, archivo);
    res.json({ mensaje: 'Producto guardado', producto: body });
});

router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { body } = req;
    const product = containerProducts.getById(parseInt(id), archivo);
    if (product) {
        containerProducts.updateProduct(parseInt(id), body, archivo);
        res.json({ mensaje: 'Producto actualizado', producto: body });
    } else {
        res.json({ mensaje: 'Producto no encontrado ' + id });
    }
});

router.delete('/:id', (req, res) => {
    const { id } = req.params;
    const product = containerProducts.getById(parseInt(id), archivo);
    if (product) {
        containerProducts.deleteById(parseInt(id), archivo);
        res.json({ product_id: id, mensaje: 'Producto eliminado' });
    } else {
        res.json({ mensaje: 'Producto no encontrado ' + id });
    }
});

module.exports = router;
