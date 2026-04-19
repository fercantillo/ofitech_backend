require('dotenv').config();

const express = require('express');
const { connectDatabase } = require('./config/database');

require('./models/User');
require('./models/Product');
require('./models/Order');
require('./models/Sesion');
const usuariosRouter = require('./routes/usuarios');
const productosRouter = require('./routes/productos');
const ordenesRouter = require('./routes/ordenes');
const loginRouter = require('./routes/login');
const sesionRouter = require('./routes/sesion');

const app = express();
const port = Number.parseInt(process.env.PORT || '3000', 10);
const host = process.env.HOST || '0.0.0.0';

app.use(express.json());

app.use('/api/usuarios', usuariosRouter);
app.use('/api/productos', productosRouter);
app.use('/api/ordenes', ordenesRouter);
app.use('/api/login', loginRouter);
app.use('/api/sesion', sesionRouter);

//Manejo de errores
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Error interno del servidor';
    
    console.error(`[${statusCode}] ${message}`);
    
    return res.status(statusCode).json({ error: message });
});

connectDatabase()
    .then(() => {
        app.listen(port, host, () => {
            console.log(`Servidor corriendo en http://${host}:${port}`);
        });
    })
    .catch((err) => {
        console.error('No se pudo conectar a MongoDB:', err.message);
        process.exit(1);
    });