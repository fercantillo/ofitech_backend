const express = require('express');
const {
    getProductos,
    getProductoById,
    crearProducto,
    actualizarProducto,
    eliminarProducto,
} = require('../controllers/productosControler');

const router = express.Router();

router.get('/', async (req, res, next) => {
    try {
        const productos = await getProductos();
        return res.status(200).json(productos);
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
        const producto = await getProductoById(id);
        return res.status(200).json(producto);
    } catch (err) {
        next(err);
    }
});

router.post('/', async (req, res, next) => {
    try {
        const { nombre, categoria, descripcion, precio, inventario } = req.body;
        const producto = await crearProducto(nombre, categoria, descripcion, precio, inventario);
        return res.status(201).json({ message: 'Producto creado correctamente', producto });
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
        const { nombre, categoria, descripcion, precio, inventario } = req.body;
        const producto = await actualizarProducto(id, nombre, categoria, descripcion, precio, inventario);
        return res.status(200).json({ message: 'Producto actualizado correctamente', producto });
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
        await eliminarProducto(id);
        return res.status(200).json({ message: 'Producto eliminado correctamente' });
    } catch (err) {
        next(err);
    }
});

module.exports = router;
