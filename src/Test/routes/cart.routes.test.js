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

describe('Cart Routes', () => {
  let newCartId;

  it('Debería crear un nuevo carrito al hacer una solicitud POST a /cart', async () => {
    const response = await request.post('/cart');
    expect(response.status).to.equal(201);
    expect(response.body.newCart).to.have.property('id');
    expect(response.body.newCart).to.have.property('products').to.be.an('array');

    newCartId = response.body.newCart.id;
  });

  it('Debería obtener un carrito específico al hacer una solicitud GET a /cart/:cid', async () => {
    const response = await request.get(`/cart/${newCartId}`);
    expect(response.status).to.equal(200);
    expect(response.body).to.be.an('array');
  });

  it('Debería agregar un producto al carrito al hacer una solicitud POST a /cart/:cid/product/:pid', async () => {
    const productId = 1;
    const quantity = 2;

    const response = await request.post(`/cart/${newCartId}/product/${productId}`).send({ quantity });
    expect(response.status).to.equal(200);
    expect(response.body.updatedCart).to.have.property('id').to.equal(newCartId);
    expect(response.body.updatedCart).to.have.property('products').to.be.an('array');
  });
});
