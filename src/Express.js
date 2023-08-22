const express = require('express');

const PORT = 3000;

const app = express();

const autos = [
  { id: 1, nombre: 'Volkswagen', precio: 1000000 },
  { id: 2, nombre: 'Audi', precio: 1500000 },
  { id: 3, nombre: 'Bmw', precio: 1200000 },
];

app.get('/autos', (req, res) => {
  const { precio } = req.query;
  let resultado = autos;

  if (precio) {
    resultado = resultado.filter(auto => auto.precio === Number(precio));
  }

  res.json(resultado);
});

app.get('/autos/:id', (req, res) => {
  const { id } = req.params;
  const auto = autos.find(auto => auto.id === Number(id));

  if (!auto) {
    res.status(404).json({ status: 'Producto no encontrado' });
  } else {
    res.json(auto);
  }
});

app.get('*', (req, res) => {
  res.status(404).send('ERROR 404 - Página no encontrada');
});

app.listen(PORT, () => {
  console.log(`Server corriendo en ${PORT}`);
});
