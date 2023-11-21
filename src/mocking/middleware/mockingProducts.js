import express from 'express';

const router = express.Router();

router.get('/mockingproducts', (req, res) => {
    const mockedProducts = generateMockedProducts(100);
    res.json(mockedProducts);
});

const generateMockedProducts = (count) => {
    const mockedProducts = [];

    for (let i = 1; i <= count; i++) {
        const product = {
            marca: `Marca${i}`,
            modelo: `Modelo${i}`,
            color: `Color${i}`,
            kilometraje: `${i * 1000} km`,
            precio: `$${i * 1000000}.00`,
            año: `${2020 + i}`,
            category: i % 2 === 0 ? 'deportivo' : 'camioneta',
            id: i,
        };

        mockedProducts.push(product);
    }

    return mockedProducts;
};

export default router;
