const mongoose = require('mongoose');

const collection = process.env.MONGODB_COLLECTION_PRODUCTS || 'products';

const productSchema = new mongoose.Schema(
    {
        id: { type: Number, required: true, unique: true },
        nombre: { type: String, required: true },
        categoria: { type: String, required: true },
        descripcion: { type: String, required: true },
        precio: { type: Number, required: true },
        inventario: { type: Number, required: true },
    },
    { collection }
);

module.exports = mongoose.models.Product || mongoose.model('Product', productSchema);
