const express = require('express');
const {
    getOrdenes,
    getOrdenById,
    crearOrden,
    actualizarOrden,
    eliminarOrden
} = require('../controllers/ordenesController');

const router = express.Router();

router.get('/', (req, res, next) => {
    try {
        const ordenes = getOrdenes();
        return res.status(200).json(ordenes);
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
        const orden = getOrdenById(id);
        return res.status(200).json(orden);
    } catch (err) {
        next(err);
    }
});

router.post('/', (req, res, next) => {
    try {
        const { idUsuario, productos, montoTotal } = req.body;
        const orden = crearOrden(idUsuario, productos, montoTotal);
        return res.status(201).json({ message: 'Orden creada correctamente', orden });
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
        const { idUsuario, productos, montoTotal } = req.body;
        const orden = actualizarOrden(id, idUsuario, productos, montoTotal);
        return res.status(200).json({ message: 'Orden actualizada correctamente', orden });
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
        eliminarOrden(id);
        return res.status(200).json({ message: 'Orden eliminada correctamente' });
    } catch (err) {
        next(err);
    }
});

module.exports = router;