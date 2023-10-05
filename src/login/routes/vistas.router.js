import { Router } from 'express';
export const router = Router();

const isAuthenticated = (req, res, next) => {
    if (req.session.usuario) {
        next();
    } else {
        return res.redirect('/login');
    }
};

const redirectToProfile = (req, res, next) => {
    if (req.session.usuario) {
        console.log('auth2 me manda a perfil');
        return res.redirect('/perfil');
    } else {
        next();
    }
};

router.get('/', (req, res) => {
    const verLogin = !req.session.usuario;

    res.status(200).render('home', { verLogin });
});

router.get('/registro', redirectToProfile, (req, res) => {
    const { error } = req.query;
    const verLogin = true;

    res.status(200).render('registro', {
        verLogin,
        error: error ? true : false,
        errorDetalle: error || ''
    });
});

router.get('/login', redirectToProfile, (req, res) => {
    const { error, usuarioCreado } = req.query;
    const verLogin = true;

    res.status(200).render('login', {
        verLogin,
        error: error ? true : false,
        errorDetalle: error || '',
        usuarioCreado: usuarioCreado ? true : false,
        usuarioCreadoDetalle: usuarioCreado || ''
    });
});

router.get('/perfil', isAuthenticated, (req, res) => {
    const { usuario } = req.session;

    res.status(200).render('perfil', {
        verLogin: false,
        usuario
    });
});
