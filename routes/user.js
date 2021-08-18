
const { Router } = require('express');
const {usuariosGet, usuariosPost, usuariosPatch, usuariosPut, usuariosDelete} = require('../controllers/usuarios');

const router = Router();

router.get('/', usuariosGet);

router.put('/:id', usuariosPut); // Els dos punts : significa que espera un paràmetre per la URL

router.post('/', usuariosPost);

router.delete('/', usuariosDelete);

router.patch('/', usuariosPatch);



module.exports = router;