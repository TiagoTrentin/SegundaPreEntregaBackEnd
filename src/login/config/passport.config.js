import passport from 'passport';
import local from 'passport-local';
import bcrypt from 'bcrypt';
import { modeloUsuarios } from '../models/usuarios.models.js';
import { Strategy as GitHubStrategy } from 'passport-github2'; 

import UserModel from '../models/user.js';

export const inicializaPassport = () => {

    passport.use('registro', new local.Strategy(
        {
            usernameField: 'email',
            passReqToCallback: true
        },
        async (req, username, password, done) => {
            try {
                const { first_name, last_name, email, age, password } = req.body;

                if (!first_name || !last_name || !email || !age || !password) {
                    return done(null, false, { message: 'Complete todos los campos' });
                }

                const existe = await modeloUsuarios.findOne({ email });
                if (existe) {
                    return done(null, false, { message: `Usuario ya está registrado: ${email}` });
                }

                const hashedPassword = await bcrypt.hash(password, 10); 

                const usuario = await UserModel.create({ 
                    first_name, 
                    last_name, 
                    email, 
                    age, 
                    password: hashedPassword,
                    role: 'user' 
                });

                console.log('Pasando por Passport registro...!!!');

                return done(null, usuario);
            } catch (error) {
                return done(error);
            }
        }
    ));

    passport.use(new GitHubStrategy({
        clientID: 'Iv1.1db47e8230110a7a', 
        clientSecret: '6b4c5f5f44f6de58d6f07925e48809cdcd0c7f8c', 
        callbackURL: 'http://localhost:3000/api/sessions/callbackGithub' 
      },
      async (Token, refreshToken, profile, done) => {
        try {
          const usuario = await modeloUsuarios.findOne({ githubId: profile.id });
          if (usuario) {
            return done(null, usuario);
          } else {
            const nuevoUsuario = await UserModel.create({
              githubId: profile.id,
              first_name: profile.username, 
              email: profile.email || '',
              role: 'user'
            });
            return done(null, nuevoUsuario);
          }
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
            const usuario = await UserModel.findById(id);
            return done(null, usuario);
        } catch (error) {
            return done(error);
        }
    });
};
