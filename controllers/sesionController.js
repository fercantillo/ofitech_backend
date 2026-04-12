const fs = require('fs');
const path = require('path');
const { HttpError } = require('../utils/HttpError');
const ruta = path.join(__dirname, '..', 'data', 'sesiones_temporal.json');

const getSesiones = () => {
    try {
        const data = fs.readFileSync(ruta, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        throw new HttpError(500, 'Error al leer las sesiones');
    }
};

const getSesionByToken = (token) => {
    const sesiones = getSesiones();
    const sesion = sesiones.find(ses => ses.token === token);

    if (!sesion) {
        throw new HttpError(401, 'Sesion no valida o expirada');
    }
    return sesion;
};

const crearSesion = (idUsuario, token) => {
    let sesiones;
    try {
        sesiones = getSesiones();
    } catch (err) {
        sesiones = [];
    }

    sesiones = sesiones.filter(ses => ses.idUsuario !== idUsuario);

    const nuevaSesion = {
        token,
        idUsuario,
        fechaCreacion: new Date().toISOString(),
        activa: true
    };

    sesiones.push(nuevaSesion);
    fs.writeFileSync(ruta, JSON.stringify(sesiones, null, 2), 'utf8');
    return nuevaSesion;
};

const eliminarSesion = (token) => {
    const sesiones = getSesiones();
    const sesionExiste = sesiones.find(ses => ses.token === token);

    if (!sesionExiste) {
        throw new HttpError(404, 'Sesion no encontrada');
    }

    const nuevasSesiones = sesiones.filter(ses => ses.token !== token);
    fs.writeFileSync(ruta, JSON.stringify(nuevasSesiones, null, 2), 'utf8');
    return true;
};

module.exports = { getSesiones, getSesionByToken, crearSesion, eliminarSesion };