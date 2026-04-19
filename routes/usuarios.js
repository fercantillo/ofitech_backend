const express = require('express');
const {
    getUsuarios,
    getUsuarioById,
    crearUsuario,
    actualizarUsuario,
    eliminarUsuario,
} = require('../controllers/usuariosController');

const router = express.Router();

router.get('/', async (req, res, next) => {
    try {
        const usuarios = await getUsuarios();
        return res.status(200).json(usuarios);
    } catch (err) {
        next(err);
    }
});

router.get('/:id', async (req, res, next) => {
    try {
        const id = parseInt(req.params.id, 10);
        if (Number.isNaN(id)) {
            return res.status(400).json({ error: 'ID invalido' });
        }
        const usuario = await getUsuarioById(id);
        return res.status(200).json(usuario);
    } catch (err) {
        next(err);
    }
});

router.post('/', async (req, res, next) => {
    try {
        const { nombre, apellidos, email, rol, contrasenia } = req.body;
        const usuario = await crearUsuario(nombre, apellidos, email, rol, contrasenia);
        return res.status(201).json({ message: 'Usuario creado correctamente', usuario });
    } catch (err) {
        next(err);
    }
});

router.put('/:id', async (req, res, next) => {
    try {
        const id = parseInt(req.params.id, 10);
        if (Number.isNaN(id)) {
            return res.status(400).json({ error: 'ID invalido' });
        }
        const { nombre, apellidos, email, rol, contrasenia } = req.body;
        const usuario = await actualizarUsuario(id, nombre, apellidos, email, rol, contrasenia);
        return res.status(200).json({ message: 'Usuario actualizado correctamente', usuario });
    } catch (err) {
        next(err);
    }
});

router.delete('/:id', async (req, res, next) => {
    try {
        const id = parseInt(req.params.id, 10);
        if (Number.isNaN(id)) {
            return res.status(400).json({ error: 'ID invalido' });
        }
        await eliminarUsuario(id);
        return res.status(200).json({ message: 'Usuario eliminado correctamente' });
    } catch (err) {
        next(err);
    }
});

module.exports = router;
