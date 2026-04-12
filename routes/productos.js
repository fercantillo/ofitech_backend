const express = require('express');
const {
    getProductos,
    getProductoById,
    crearProducto,
    actualizarProducto,
    eliminarProducto
} = require('../controllers/productosControler');

const router = express.Router();

router.get('/', (req, res, next) => {
    try {
        const productos = getProductos();
        return res.status(200).json(productos);
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
        const producto = getProductoById(id);
        return res.status(200).json(producto);
    } catch (err) {
        next(err);
    }
});

router.post('/', (req, res, next) => {
    try {
        const { nombre, categoria, descripcion, precio, inventario } = req.body;
        const producto = crearProducto(nombre, categoria, descripcion, precio, inventario);
        return res.status(201).json({ message: 'Producto creado correctamente', producto });
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
        const { nombre, categoria, descripcion, precio, inventario } = req.body;
        const producto = actualizarProducto(id, nombre, categoria, descripcion, precio, inventario);
        return res.status(200).json({ message: 'Producto actualizado correctamente', producto });
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
        eliminarProducto(id);
        return res.status(200).json({ message: 'Producto eliminado correctamente' });
    } catch (err) {
        next(err);
    }
});

module.exports = router;