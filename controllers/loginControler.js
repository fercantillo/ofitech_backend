const { v4: uuidv4 } = require('uuid');
const User = require('../models/User');
const { HttpError } = require('../utils/HttpError');
const { crearSesion } = require('./sesionController');

const login = async (id, contrasenia) => {
    const idNum = typeof id === 'number' && !Number.isNaN(id) ? id : parseInt(String(id), 10);
    if (Number.isNaN(idNum)) {
        throw new HttpError(400, 'ID invalido');
    }

    const usuario = await User.findOne({ id: idNum }).lean();
    if (!usuario) {
        throw new HttpError(401, 'Usuario o contrasenia incorrectos');
    }

    if (usuario.contrasenia !== contrasenia) {
        throw new HttpError(401, 'Usuario o contrasenia incorrectos');
    }

    const token = uuidv4();
    await crearSesion(idNum, token);
    return token;
};

module.exports = { login };
