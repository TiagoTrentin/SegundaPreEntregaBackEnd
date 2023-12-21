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

describe('Session Routes', () => {
  let authenticatedUser = {};

  it('Debería registrar un nuevo usuario al hacer una solicitud POST a /api/sessions/registro', async () => {
    const newUser = {
      nombre: 'NuevoUsuario',
      email: 'nuevo@example.com',
      password: 'contraseña123',
      age: 25,
      lastName: 'ApellidoNuevo',
    };

    const response = await request.post('/api/sessions/registro').send(newUser);
    expect(response.status).to.equal(200);
    expect(response.body).to.have.property('message').to.equal('Usuario registrado correctamente');
    expect(response.body).to.have.property('user').to.be.an('object');
  });

  it('Debería iniciar sesión al hacer una solicitud POST a /api/sessions/login', async () => {
    const userCredentials = {
      email: 'nuevo@example.com',
      password: 'contraseña123',
    };

    const response = await request.post('/api/sessions/login').send(userCredentials);
    expect(response.status).to.equal(302); 
    expect(response.headers).to.have.property('set-cookie').to.be.an('array').that.is.not.empty;

    authenticatedUser = {
      email: userCredentials.email,
      cookie: response.headers['set-cookie'][0],
    };
  });

  it('Debería obtener información del usuario autenticado al hacer una solicitud GET a /api/sessions/me', async () => {
    const response = await request.get('/api/sessions/me').set('Cookie', authenticatedUser.cookie);
    expect(response.status).to.equal(200);
    expect(response.body).to.have.property('email').to.equal(authenticatedUser.email);
  });

  it('Debería cerrar sesión al hacer una solicitud GET a /api/sessions/logout', async () => {
    const response = await request.get('/api/sessions/logout').set('Cookie', authenticatedUser.cookie);
    expect(response.status).to.equal(302); 
    expect(response.headers).to.have.property('set-cookie').to.be.an('array').that.is.empty;
  });
});
