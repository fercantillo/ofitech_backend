const mongoose = require('mongoose');

/**
 * Conecta a MongoDB usando MONGODB_URI del entorno.
 * El nombre de la base suele ir al final de la URI (p. ej. .../ofitech).
 */
async function connectDatabase() {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
        throw new Error('Define MONGODB_URI en .env (copia desde .env.example)');
    }

    await mongoose.connect(uri);
    console.log('MongoDB conectado');
}

module.exports = { connectDatabase };
