const Product = require('../models/Product');
const { HttpError } = require('../utils/HttpError');
const { toApiShape, toApiShapeList } = require('../utils/mongoDoc');

async function siguienteIdProducto() {
    const ultimo = await Product.findOne().sort({ id: -1 }).select('id').lean();
    return ultimo ? ultimo.id + 1 : 1;
}

function mapDuplicateKey(err) {
    if (err.code === 11000) {
        throw new HttpError(409, 'Conflicto: dato duplicado');
    }
    throw err;
}


 //Genera la URL de la API externa de Picsum.

const fetchRandomImage = (nombre, id) => {
    // Usamos el nombre y ID como semilla para que la imagen sea constante
    const seed = nombre.replace(/\s+/g, '') + id;
    return `https://picsum.photos/seed/${seed}/300/300`;
};

const getProductos = async () => {
    try {
        const productos = await Product.find().sort({ id: 1 }).lean();
        const apiProductos = toApiShapeList(productos);

        //  la URL de la API externa a cada producto antes de enviarlo
        return apiProductos.map((prod) => ({
            ...prod,
            imagen: fetchRandomImage(prod.nombre, prod.id)
        }));
    } catch (error) {
        throw new HttpError(500, 'Error al obtener productos');
    }
};

const getProductoById = async (id) => {
    try {
        const producto = await Product.findOne({ id }).lean();
        if (!producto) {
            throw new HttpError(404, 'Producto no encontrado');
        }
        
        const apiProducto = toApiShape(producto);
        return {
            ...apiProducto,
            imagen: fetchRandomImage(apiProducto.nombre, apiProducto.id)
        };
    } catch (error) {
        if (error instanceof HttpError) throw error;
        throw new HttpError(500, 'Error al obtener el producto');
    }
};

const crearProducto = async (nombre, categoria, descripcion, precio, inventario) => {
    if (!nombre || !categoria || !descripcion || !precio || !inventario) {
        throw new HttpError(400, 'Faltan datos obligatorios');
    }

    const nuevoId = await siguienteIdProducto();
    const nuevoProducto = {
        id: nuevoId,
        nombre,
        categoria,
        descripcion,
        precio,
        inventario,
    };

    try {
        await Product.create(nuevoProducto);
    } catch (err) {
        mapDuplicateKey(err);
    }
    return nuevoProducto;
};

const actualizarProducto = async (id, nombre, categoria, descripcion, precio, inventario) => {
    try {
        const actualizado = await Product.findOneAndUpdate(
            { id },
            { $set: { nombre, categoria, descripcion, precio, inventario } },
            { new: true, lean: true, runValidators: true }
        );
        if (!actualizado) {
            throw new HttpError(404, 'Producto no encontrado');
        }
        return toApiShape(actualizado);
    } catch (err) {
        if (err instanceof HttpError) {
            throw err;
        }
        mapDuplicateKey(err);
    }
};

const eliminarProducto = async (id) => {
    const borrado = await Product.findOneAndDelete({ id });
    if (!borrado) {
        throw new HttpError(404, 'Orden no encontrada'); // Mantengo el mensaje original de tu archivo
    }
    return true;
};

module.exports = { 
    getProductos, 
    getProductoById, 
    crearProducto, 
    actualizarProducto, 
    eliminarProducto 
};