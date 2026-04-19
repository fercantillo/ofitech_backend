const express = require('express');
const {
    getOrdenes,
    getOrdenById,
    crearOrden,
    actualizarOrden,
    eliminarOrden,
} = require('../controllers/ordenesController');

const router = express.Router();

router.get('/', async (req, res, next) => {
    try {
        const ordenes = await getOrdenes();
        return res.status(200).json(ordenes);
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
        const orden = await getOrdenById(id);
        return res.status(200).json(orden);
    } catch (err) {
        next(err);
    }
});

router.post('/', async (req, res, next) => {
    try {
        const { idUsuario, productos, montoTotal } = req.body;
        const orden = await crearOrden(idUsuario, productos, montoTotal);
        return res.status(201).json({ message: 'Orden creada correctamente', orden });
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
        const { idUsuario, productos, montoTotal } = req.body;
        const orden = await actualizarOrden(id, idUsuario, productos, montoTotal);
        return res.status(200).json({ message: 'Orden actualizada correctamente', orden });
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
        await eliminarOrden(id);
        return res.status(200).json({ message: 'Orden eliminada correctamente' });
    } catch (err) {
        next(err);
    }
});

module.exports = router;
