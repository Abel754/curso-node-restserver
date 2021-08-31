
const { Router } = require('express');
const { check } = require('express-validator'); // npm i express-validator
const {validarCampos, validarJWT} = require('../middlewares');
const { login, googleSignin, renovarToken } = require('../controllers/auth');


const router = Router();

router.post('/login', [
    check('correo', 'El correo es obligatorio').isEmail(), // correo és el nom que s'enviarà pel body (postman)
    check('password', 'El password es obligatorio').not().isEmpty(), 
    validarCampos
], login);

router.post('/google', [
    check('id_token', 'El id_token es necesario').not().isEmpty(), // Paràmetre enviat al Postman
    validarCampos
], googleSignin);

router.get('/', validarJWT, renovarToken);


module.exports = router;