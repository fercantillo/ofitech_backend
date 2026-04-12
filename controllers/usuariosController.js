const fs = require('fs');
const path = require('path');
const { HttpError } = require('../utils/HttpError');
const ruta = path.join(__dirname, '..', 'data', 'usuarios_temporal.json');

const getUsuarios = () => {
    try {
        const data = fs.readFileSync(ruta, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        throw new HttpError(500, 'Error al leer los usuarios');
    }
};

const getUsuarioById = (id) => {
    const usuarios = getUsuarios();
    const usuario = usuarios.find(usu => usu.id === id);

    if (!usuario) {
        throw new HttpError(404, 'Usuario no encontrado');
    }
    return usuario;
};

const crearUsuario = (nombre, apellidos, email, rol, contrasenia) => {
    if (!nombre || !apellidos || !email || !rol || !contrasenia) {
        throw new HttpError(400, 'Faltan datos obligatorios');
    }

    const usuarios = getUsuarios();
    const ultimoUsuario = usuarios.at(-1);

    const nuevoUsuario = {
        id: ultimoUsuario ? ultimoUsuario.id + 1 : 1,
        nombre,
        apellidos,
        email,
        rol,
        contrasenia
    };

    usuarios.push(nuevoUsuario);
    fs.writeFileSync(ruta, JSON.stringify(usuarios, null, 2), 'utf8');
    return nuevoUsuario;
};

const actualizarUsuario = (id, nombre, apellidos, email, rol, contrasenia) => {
    const usuarios = getUsuarios();
    const usuario = usuarios.find(usu => usu.id === id);

    if (!usuario) {
        throw new HttpError(404, 'Usuario no encontrado');
    }

    usuario.nombre = nombre;
    usuario.apellidos = apellidos;
    usuario.email = email;
    usuario.rol = rol;
    usuario.contrasenia = contrasenia;

    fs.writeFileSync(ruta, JSON.stringify(usuarios, null, 2), 'utf8');
    return usuario;
};

const eliminarUsuario = (id) => {
    let usuarios = getUsuarios();
    const existe = usuarios.find(usu => usu.id === id);

    if (!existe) {
        throw new HttpError(404, 'Usuario no encontrado');
    }

    usuarios = usuarios.filter(usu => usu.id !== id);
    fs.writeFileSync(ruta, JSON.stringify(usuarios, null, 2), 'utf8');
    return true;
};

module.exports = { getUsuarios, getUsuarioById, crearUsuario, actualizarUsuario, eliminarUsuario };