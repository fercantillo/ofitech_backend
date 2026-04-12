const fs = require('fs');
const path = require('path');
const { HttpError } = require('../utils/HttpError');
const ruta = path.join(__dirname, '..', 'data', 'productos_temporal.json');

const getProductos = () => {
    try {
        const data = fs.readFileSync(ruta, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        throw new HttpError(500, 'Error al leer los productos');
    }
};

const getProductoById = (id) => {
    const productos = getProductos();
    const producto = productos.find(prod => prod.id === id);

    if (!producto) {
        throw new HttpError(404, 'Producto no encontrado');
    }
    return producto;
};

const crearProducto = (nombre, categoria, descripcion, precio, inventario) => {
    if (!nombre || !categoria || !descripcion || !precio || !inventario) {
        throw new HttpError(400, 'Faltan datos obligatorios');
    }

    const productos = getProductos();
    const ultimoProducto = productos.at(-1);

    const nuevoProducto = {
        id: ultimoProducto ? ultimoProducto.id + 1 : 1,
        nombre,
        categoria,
        descripcion,
        precio,
        inventario
    };

    productos.push(nuevoProducto);
    fs.writeFileSync(ruta, JSON.stringify(productos, null, 2), 'utf8');
    return nuevoProducto;
};

const actualizarProducto = (id, nombre, categoria, descripcion, precio, inventario) => {
    const productos = getProductos();
    const producto = productos.find(prod => prod.id === id);

    if (!producto) {
        throw new HttpError(404, 'Producto no encontrado');
    }

    producto.nombre = nombre;
    producto.categoria = categoria;
    producto.descripcion = descripcion;
    producto.precio = precio;
    producto.inventario = inventario;

    fs.writeFileSync(ruta, JSON.stringify(productos, null, 2), 'utf8');
    return producto;
};

const eliminarProducto = (id) => {
    let productos = getProductos();
    const existe = productos.find(prod => prod.id === id);

    if (!existe) {
        throw new HttpError(404, 'Producto no encontrado');
    }

    productos = productos.filter(prod => prod.id !== id);
    fs.writeFileSync(ruta, JSON.stringify(productos, null, 2), 'utf8');
    return true;
};

module.exports = { getProductos, getProductoById, crearProducto, actualizarProducto, eliminarProducto };