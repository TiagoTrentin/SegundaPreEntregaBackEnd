import { Router } from 'express';
import crypto from 'crypto';
import { modeloUsuarios } from '../models/usuarios.models.js';
import passport from 'passport';

export const router = Router();

router.get('/errorRegistro', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json({
        error: 'Error de registro'
    });
});

router.post('/registro', passport.authenticate('registro', { failureRedirect: '/api/sessions/errorRegistro' }), async (req, res) => {
    let { nombre, email, password, age, lastName } = req.body;

    password = crypto.createHmac('sha256', 'palabraSecreta').update(password).digest('base64');

    await modeloUsuarios.create({
        nombre,
        email,
        password,
        age,
        lastName
    });

    console.log(req.user);

    res.redirect(`/login?usuarioCreado=${email}`);
});

router.post('/login', async (req, res) => {
    let { email, password } = req.body;

    if (!email || !password) {
        return res.redirect('/login?error=Faltan datos');
    }

    password = crypto.createHmac('sha256', 'palabraSecreta').update(password).digest('base64');

    let usuario = await modeloUsuarios.findOne({ email, password });
    if (!usuario) {
        return res.redirect('/login?error=credenciales incorrectas');
    }

    req.session.usuario = {
        nombre: usuario.nombre,
        email: usuario.email
    }

    res.redirect('/perfil');
});

router.get('/logout', (req, res) => {
    req.session.destroy(e => console.log(e));
    res.redirect('/login?mensaje=logout correcto...!!!');
});
