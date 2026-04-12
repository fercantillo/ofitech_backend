const express = require('express');
const usuariosRouter = require('./routes/usuarios');
const productosRouter = require('./routes/productos');
const ordenesRouter = require('./routes/ordenes');
const loginRouter = require('./routes/login');
const sesionRouter = require('./routes/sesion');

const app = express();
const port = 3000;

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

app.listen(port, () => {
    console.log(`Servidor corriendo en puerto ${port}`);
});