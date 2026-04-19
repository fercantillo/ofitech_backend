const Sesion = require('../models/Sesion');
const { HttpError } = require('../utils/HttpError');
const { toApiShape, toApiShapeList } = require('../utils/mongoDoc');

const getSesiones = async () => {
    const sesiones = await Sesion.find().lean();
    return toApiShapeList(sesiones);
};

const getSesionByToken = async (token) => {
    const sesion = await Sesion.findOne({ token }).lean();
    if (!sesion) {
        throw new HttpError(401, 'Sesion no valida o expirada');
    }
    return toApiShape(sesion);
};

const crearSesion = async (idUsuario, token) => {
    await Sesion.deleteMany({ idUsuario });

    const nuevaSesion = {
        token,
        idUsuario,
        fechaCreacion: new Date().toISOString(),
        activa: true,
    };

    await Sesion.create(nuevaSesion);
    return nuevaSesion;
};

const eliminarSesion = async (token) => {
    const borrado = await Sesion.findOneAndDelete({ token });
    if (!borrado) {
        throw new HttpError(404, 'Sesion no encontrada');
    }
    return true;
};

module.exports = { getSesiones, getSesionByToken, crearSesion, eliminarSesion };
