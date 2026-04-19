const User = require('../models/User');
const { HttpError } = require('../utils/HttpError');
const { toApiShape, toApiShapeList } = require('../utils/mongoDoc');

async function siguienteIdUsuario() {
    const ultimo = await User.findOne().sort({ id: -1 }).select('id').lean();
    return ultimo ? ultimo.id + 1 : 1;
}

function mapDuplicateKey(err) {
    if (err.code === 11000) {
        const campo = Object.keys(err.keyPattern || {})[0];
        if (campo === 'email') {
            throw new HttpError(409, 'El email ya está registrado');
        }
        throw new HttpError(409, 'Conflicto: dato duplicado');
    }
    throw err;
}

const getUsuarios = async () => {
    const usuarios = await User.find().sort({ id: 1 }).lean();
    return toApiShapeList(usuarios);
};

const getUsuarioById = async (id) => {
    const usuario = await User.findOne({ id }).lean();
    if (!usuario) {
        throw new HttpError(404, 'Usuario no encontrado');
    }
    return toApiShape(usuario);
};

const crearUsuario = async (nombre, apellidos, email, rol, contrasenia) => {
    if (!nombre || !apellidos || !email || !rol || !contrasenia) {
        throw new HttpError(400, 'Faltan datos obligatorios');
    }

    const nuevoId = await siguienteIdUsuario();
    const nuevoUsuario = {
        id: nuevoId,
        nombre,
        apellidos,
        email,
        rol,
        contrasenia,
    };

    try {
        await User.create(nuevoUsuario);
    } catch (err) {
        mapDuplicateKey(err);
    }
    return nuevoUsuario;
};

const actualizarUsuario = async (id, nombre, apellidos, email, rol, contrasenia) => {
    try {
        const actualizado = await User.findOneAndUpdate(
            { id },
            { $set: { nombre, apellidos, email, rol, contrasenia } },
            { new: true, lean: true, runValidators: true }
        );
        if (!actualizado) {
            throw new HttpError(404, 'Usuario no encontrado');
        }
        return toApiShape(actualizado);
    } catch (err) {
        if (err instanceof HttpError) {
            throw err;
        }
        mapDuplicateKey(err);
    }
};

const eliminarUsuario = async (id) => {
    const borrado = await User.findOneAndDelete({ id });
    if (!borrado) {
        throw new HttpError(404, 'Usuario no encontrado');
    }
    return true;
};

module.exports = { getUsuarios, getUsuarioById, crearUsuario, actualizarUsuario, eliminarUsuario };
