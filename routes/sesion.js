const express = require('express');
const { getSesionByToken, eliminarSesion } = require('../controllers/sesionController');
const { getUsuarioById } = require('../controllers/usuariosController');

const router = express.Router();

router.get('/', (req, res, next) => {
    try {
        const token = req.headers.authorization;
        if (!token) {
            return res.status(401).json({ error: 'Token no proporcionado' });
        }

        const sesion = getSesionByToken(token);
        const usuario = getUsuarioById(sesion.idUsuario);

        const { contrasenia, ...usuarioSinPassword } = usuario;

        return res.status(200).json({
            sesion: {
                token: sesion.token,
                fechaCreacion: sesion.fechaCreacion,
                activa: sesion.activa
            },
            usuario: usuarioSinPassword
        });
    } catch (err) {
        next(err);
    }
});

router.delete('/', (req, res, next) => {
    try {
        const token = req.headers.authorization;
        if (!token) {
            return res.status(401).json({ error: 'Token no proporcionado' });
        }

        eliminarSesion(token);
        return res.status(200).json({ message: 'Sesion cerrada correctamente' });
    } catch (err) {
        next(err);
    }
});

module.exports = router;