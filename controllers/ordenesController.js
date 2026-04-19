const Order = require('../models/Order');
const { HttpError } = require('../utils/HttpError');
const { toApiShape, toApiShapeList } = require('../utils/mongoDoc');

async function siguienteIdOrden() {
    const ultimo = await Order.findOne().sort({ id: -1 }).select('id').lean();
    return ultimo ? ultimo.id + 1 : 1;
}

function mapDuplicateKey(err) {
    if (err.code === 11000) {
        throw new HttpError(409, 'Conflicto: dato duplicado');
    }
    throw err;
}

const getOrdenes = async () => {
    const ordenes = await Order.find().sort({ id: 1 }).lean();
    return toApiShapeList(ordenes);
};

const getOrdenById = async (id) => {
    const orden = await Order.findOne({ id }).lean();
    if (!orden) {
        throw new HttpError(404, 'Orden no encontrada');
    }
    return toApiShape(orden);
};

const crearOrden = async (idUsuario, productos, montoTotal) => {
    if (!idUsuario || !productos || !montoTotal) {
        throw new HttpError(400, 'Faltan datos obligatorios');
    }

    const nuevoId = await siguienteIdOrden();
    const nuevaOrden = {
        id: nuevoId,
        fecha: new Date().toISOString().split('T')[0],
        idUsuario,
        estado: 'pendiente',
        fechaDespachado: null,
        fechaEntregado: null,
        productos,
        montoTotal,
    };

    try {
        await Order.create(nuevaOrden);
    } catch (err) {
        mapDuplicateKey(err);
    }
    return nuevaOrden;
};

const actualizarOrden = async (id, idUsuario, productos, montoTotal) => {
    try {
        const actualizado = await Order.findOneAndUpdate(
            { id },
            { $set: { idUsuario, productos, montoTotal } },
            { new: true, lean: true, runValidators: true }
        );
        if (!actualizado) {
            throw new HttpError(404, 'Orden no encontrada');
        }
        return toApiShape(actualizado);
    } catch (err) {
        if (err instanceof HttpError) {
            throw err;
        }
        mapDuplicateKey(err);
    }
};

const eliminarOrden = async (id) => {
    const borrado = await Order.findOneAndDelete({ id });
    if (!borrado) {
        throw new HttpError(404, 'Orden no encontrada');
    }
    return true;
};

module.exports = { getOrdenes, getOrdenById, crearOrden, actualizarOrden, eliminarOrden };
