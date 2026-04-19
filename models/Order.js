const mongoose = require('mongoose');

const collection = process.env.MONGODB_COLLECTION_ORDERS || 'orders';

const lineaProductoSchema = new mongoose.Schema(
    {
        id: { type: Number, required: true },
        cantidad: { type: Number, required: true },
        precio: { type: Number, required: true },
    },
    { _id: false }
);

const orderSchema = new mongoose.Schema(
    {
        id: { type: Number, required: true, unique: true },
        fecha: { type: String, required: true },
        idUsuario: { type: Number, required: true },
        estado: { type: String, required: true },
        fechaDespachado: { type: String, default: null },
        fechaEntregado: { type: String, default: null },
        productos: { type: [lineaProductoSchema], required: true },
        montoTotal: { type: Number, required: true },
    },
    { collection }
);

module.exports = mongoose.models.Order || mongoose.model('Order', orderSchema);
