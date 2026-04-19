const mongoose = require('mongoose');

const collection = process.env.MONGODB_COLLECTION_USERS || 'users';

const userSchema = new mongoose.Schema(
    {
        id: { type: Number, required: true, unique: true },
        nombre: { type: String, required: true },
        apellidos: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        rol: { type: String, required: true },
        contrasenia: { type: String, required: true },
    },
    { collection }
);

module.exports = mongoose.models.User || mongoose.model('User', userSchema);
