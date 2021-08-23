
const { Router } = require('express');
const { check } = require('express-validator'); // npm i express-validator
const {validarCampos} = require('../middlewares/validar-campos');
const { login } = require('../controllers/auth');


const router = Router();

router.post('/login', [
    check('correo', 'El correo es obligatorio').isEmail(), // correo és el nom que s'enviarà pel body (postman)
    check('password', 'El password es obligatorio').not().isEmpty(), 
    validarCampos
], login);


module.exports = router;