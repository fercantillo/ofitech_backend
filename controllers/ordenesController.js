const fs = require('fs');
const path = require('path');
const { HttpError } = require('../utils/HttpError');
const ruta = path.join(__dirname, '..', 'data', 'ordenes_temporal.json');

const getOrdenes = () => {
    try {
        const data = fs.readFileSync(ruta, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        throw new HttpError(500, 'Error al leer las ordenes');
    }
};

const getOrdenById = (id) => {
    const ordenes = getOrdenes();
    const orden = ordenes.find(ord => ord.id === id);

    if (!orden) {
        throw new HttpError(404, 'Orden no encontrada');
    }
    return orden;
};

const crearOrden = (idUsuario, productos, montoTotal) => {
    if (!idUsuario || !productos || !montoTotal) {
        throw new HttpError(400, 'Faltan datos obligatorios');
    }

    const ordenes = getOrdenes();
    const ultimaOrden = ordenes.at(-1);

    const nuevaOrden = {
        id: ultimaOrden ? ultimaOrden.id + 1 : 1,
        fecha: new Date().toISOString().split('T')[0],
        idUsuario,
        estado: "pendiente",
        fechaDespachado: null,
        fechaEntregado: null,
        productos,
        montoTotal
    };

    ordenes.push(nuevaOrden);
    fs.writeFileSync(ruta, JSON.stringify(ordenes, null, 2), 'utf8');
    return nuevaOrden;
};

const actualizarOrden = (id, idUsuario, productos, montoTotal) => {
    const ordenes = getOrdenes();
    const orden = ordenes.find(ord => ord.id === id);

    if (!orden) {
        throw new HttpError(404, 'Orden no encontrada');
    }

    orden.idUsuario = idUsuario;
    orden.productos = productos;
    orden.montoTotal = montoTotal;

    fs.writeFileSync(ruta, JSON.stringify(ordenes, null, 2), 'utf8');
    return orden;
};

const eliminarOrden = (id) => {
    let ordenes = getOrdenes();
    const existe = ordenes.find(ord => ord.id === id);

    if (!existe) {
        throw new HttpError(404, 'Orden no encontrada');
    }

    ordenes = ordenes.filter(ord => ord.id !== id);
    fs.writeFileSync(ruta, JSON.stringify(ordenes, null, 2), 'utf8');
    return true;
};

module.exports = { getOrdenes, getOrdenById, crearOrden, actualizarOrden, eliminarOrden };