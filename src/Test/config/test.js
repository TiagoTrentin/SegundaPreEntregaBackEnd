const supertest = require('supertest');
const chai = require('chai');
const app = require('../../app');

const expect = chai.expect;
const request = supertest(app);

describe('API Tests', () => {
  it('Debería devolver un código 200 y un objeto JSON', async () => {
    const response = await request.get('/ruta-de-tu-api');
    expect(response.status).to.equal(200);
    expect(response.body).to.be.an('object');
  });
});
