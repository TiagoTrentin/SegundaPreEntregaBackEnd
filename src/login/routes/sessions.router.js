import { Router } from 'express';
import bcrypt from 'bcrypt';
import passport from 'passport';
import { modeloUsuarios } from '../models/usuarios.models.js';

export const router = Router();

const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
};

const hasRequiredDocuments = async (req, res, next) => {
  const { uid } = req.params;

  try {
    const usuario = await modeloUsuarios.findById(uid);

    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado.' });
    }

    if (!usuario.identificacion || !usuario.comprobanteDomicilio || !usuario.comprobanteEstadoCuenta) {
      return res.status(400).json({ error: 'El usuario no ha cargado todos los documentos requeridos.' });
    }

    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
};

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
    lastName,
    last_connection: new Date()
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
      await modeloUsuarios.updateOne({ email }, { last_connection: new Date() });

      req.session.usuario = {
        nombre: usuario.nombre,
        email: usuario.email
      };

      res.redirect('/perfil');
    } else {
      res.redirect('/login?error=credenciales incorrectas');
    }
  } catch (error) {
    console.error(error);
    res.redirect('/login?error=Error interno');
  }
});

router.post('/premium/:uid', isAuthenticated, hasRequiredDocuments, async (req, res) => {
  const { uid } = req.params;

  try {
    const usuario = await modeloUsuarios.findByIdAndUpdate(uid, { esPremium: true }, { new: true });

    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado.' });
    }

    res.status(200).json({ mensaje: 'Usuario actualizado a premium correctamente.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
});

router.get('/logout', isAuthenticated, async (req, res) => {
  await modeloUsuarios.updateOne({ email: req.session.usuario.email }, { last_connection: new Date() });

  req.logout();
  res.redirect('/login?mensaje=logout correcto...!!!');
});
