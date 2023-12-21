import supertest from 'supertest'
import chai from 'chai'
import mongoose from 'mongoose'
import {describe, it} from 'mocha'
import fs from 'fs'

const supertest = require('supertest');
const chai = require('chai');
const app = require('../../../app.js');

const expect = chai.expect;
const request = supertest(app);

describe('Product Routes', () => {
  let productId;

  it('Debería obtener todos los productos al hacer una solicitud GET a /products', async () => {
    const response = await request.get('/products');
    expect(response.status).to.equal(200);
    expect(response.body).to.be.an('array');
  });

  it('Debería obtener un producto específico al hacer una solicitud GET a /products/:pid', async () => {
    const response = await request.get(`/products/${productId}`);
    expect(response.status).to.equal(200);
    expect(response.body).to.be.an('object');
  });

  it('Debería crear un nuevo producto al hacer una solicitud POST a /products', async () => {
    const newProductData = {
      title: 'Nuevo Producto',
      description: 'Descripción del nuevo producto',
      code: 'Codigo del producto',
      price: 'Valor del producto',
      stock: 'Cantidad de stock',
      category: 'Categoria del producto',
    };

    const response = await request.post('/products').send(newProductData);
    expect(response.status).to.equal(201);
    expect(response.body.newProduct).to.have.property('id');
    productId = response.body.newProduct.id;
  });

  it('Debería actualizar un producto existente al hacer una solicitud PUT a /products/:pid', async () => {
    const updatedProductData = {
      title: 'Producto Actualizado',
      description: 'Nueva descripción',
      price: 'Nuevo valor',
    };

    const response = await request.put(`/products/${productId}`).send(updatedProductData);
    expect(response.status).to.equal(200);
    expect(response.body.updatedProduct).to.have.property('id').to.equal(productId);
    expect(response.body.updatedProduct.title).to.equal(updatedProductData.title);
    expect(response.body.updatedProduct.description).to.equal(updatedProductData.description);
    expect(response.body.updatedProduct.price).to.equal(updatedProductData.price);
  });
});
