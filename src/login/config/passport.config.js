import passport from 'passport';
import local from 'passport-local';
import crypto from 'crypto';
import { modeloUsuarios } from '../models/usuarios.models.js';

export const inicializaPassport = () => {

    passport.use('registro', new local.Strategy(
        {
            usernameField: 'email',
            passReqToCallback: true
        },
        async (req, username, password, done) => {
            try {
                const { nombre, email, password } = req.body;

                if (!nombre || !email || !password) {
                    return done(null, false, { message: 'Complete email, nombre, y contraseña' });
                }

                const existe = await modeloUsuarios.findOne({ email });
                if (existe) {
                    return done(null, false, { message: `Usuario ya está registrado: ${email}` });
                }

                const hashedPassword = crypto.createHmac('sha256', 'palabraSecreta').update(password).digest('base64');

                const usuario = await modeloUsuarios.create({ nombre, email, password: hashedPassword });

                console.log('pasando x passport registro...!!!');

                return done(null, usuario);
            } catch (error) {
                return done(error);
            }
        }
    ));

    passport.serializeUser((user, done) => {
        done(null, user._id);
    });

    passport.deserializeUser(async (id, done) => {
        try {
            const usuario = await modeloUsuarios.findById(id);
            return done(null, usuario);
        } catch (error) {
            return done(error);
        }
    });
};
