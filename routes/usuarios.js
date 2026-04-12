const express = require('express');
const {
    getUsuarios,
    getUsuarioById,
    crearUsuario,
    actualizarUsuario,
    eliminarUsuario
} = require('../controllers/usuariosController');

const router = express.Router();

router.get('/', (req, res, next) => {
    try {
        const usuarios = getUsuarios();
        return res.status(200).json(usuarios);
    } catch (err) {
        next(err);
    }
});

router.get('/:id', (req, res, next) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({ error: 'ID invalido' });
        }
        const usuario = getUsuarioById(id);
        return res.status(200).json(usuario);
    } catch (err) {
        next(err);
    }
});

router.post('/', (req, res, next) => {
    try {
        const { nombre, apellidos, email, rol, contrasenia } = req.body;
        const usuario = crearUsuario(nombre, apellidos, email, rol, contrasenia);
        return res.status(201).json({ message: 'Usuario creado correctamente', usuario });
    } catch (err) {
        next(err);
    }
});

router.put('/:id', (req, res, next) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({ error: 'ID invalido' });
        }
        const { nombre, apellidos, email, rol, contrasenia } = req.body;
        const usuario = actualizarUsuario(id, nombre, apellidos, email, rol, contrasenia);
        return res.status(200).json({ message: 'Usuario actualizado correctamente', usuario });
    } catch (err) {
        next(err);
    }
});

router.delete('/:id', (req, res, next) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({ error: 'ID invalido' });
        }
        eliminarUsuario(id);
        return res.status(200).json({ message: 'Usuario eliminado correctamente' });
    } catch (err) {
        next(err);
    }
});

module.exports = router;