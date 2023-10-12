import { Router } from 'express';
import bcrypt from 'bcrypt'; 
import passport from 'passport';
import { modeloUsuarios } from '../models/usuarios.models.js';

export const router = Router();

router.get('/errorRegistro', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json({
        error: 'Error de registro'
    });
});

router.post('/registro', passport.authenticate('registro', { failureRedirect: '/api/sessions/errorRegistro' }), async (req, res) => {
    let { nombre, email, password, age, lastName } = req.body;

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

    try {
        const usuario = await modeloUsuarios.findOne({ email });
        if (!usuario) {
            return res.redirect('/login?error=credenciales incorrectas');
        }

        const match = await bcrypt.compare(password, usuario.password);
        if (match) {
            req.session.usuario = {
                nombre: usuario.nombre,
                email: usuario.email
            }

            res.redirect('/perfil');
        } else {
            res.redirect('/login?error=credenciales incorrectas');
        }
    } catch (error) {
        console.error(error);
        res.redirect('/login?error=Error interno');
    }
});

router.get('/logout', (req, res) => {
    req.session.destroy(e => console.log(e));
    res.redirect('/login?mensaje=logout correcto...!!!');
});
