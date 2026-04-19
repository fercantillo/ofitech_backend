const mongoose = require('mongoose');

const collection = process.env.MONGODB_COLLECTION_SESSIONS || 'sesions';

const sesionSchema = new mongoose.Schema(
    {
        token: { type: String, required: true, unique: true },
        idUsuario: { type: Number, required: true },
        fechaCreacion: { type: String, required: true },
        activa: { type: Boolean, required: true, default: true },
    },
    { collection }
);

module.exports = mongoose.models.Sesion || mongoose.model('Sesion', sesionSchema);
