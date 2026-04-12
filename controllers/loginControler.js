const fs = require('fs');
const path = require('path');
const { getUsuarios } = require('./usuariosController');
const { crearSesion } = require('./sesionController');
const { v4: uuidv4 } = require('uuid');


const login = (id, contrasenia) => {
    const usuarios = getUsuarios();
    const usuario = usuarios.find(usu => usu.id === id);

    if (!usuario) {
        console.error('Usuario no encontrado');
        return -1;
    }

    if (usuario.contrasenia === contrasenia) {
        const token = uuidv4();
        crearSesion(id, token);
        return token;
    } else {
        console.error('Contrasenia incorrecta');
        return -1;
    }
}

module.exports = { login };
