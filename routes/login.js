const express = require('express');
const { login } = require('../controllers/loginControler');

const router = express.Router();

router.post('/', async (req, res, next) => {
    try {
        const { id, contrasenia } = req.body;
        if (id == null || !contrasenia) {
            return res.status(400).json({ error: 'ID y contrasenia son requeridos' });
        }
        const token = await login(id, contrasenia);
        return res.status(200).json({ token });
    } catch (err) {
        next(err);
    }
});

module.exports = router;
