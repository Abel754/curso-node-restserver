
const { Router } = require('express');
const { check } = require('express-validator'); // npm i express-validator
const {validarJWT, validarCampos, tieneRole, esAdminRole} = require('../middlewares');

const { crearProducto, obtenerProductos, obtenerProducto, actualizarProducto, borrarProducto } = require('../controllers/productos');

const { existeCategoriaPorId, existeProductoPorId } = require('../helpers/db-validators');

const router = Router();

/**
 * {{url}}/api/productos
 */

// Obtener todos los productos - público
router.get('/', obtenerProductos);

// Obtener un producto por id - público
router.get('/:id', [
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom( existeProductoPorId ),
    validarCampos,
], obtenerProducto);

// Crear producto - privado - cualquier persona con token válido
router.post('/', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('categoria', 'No es un id de Mongo').isMongoId(),
    check('categoria').custom( existeCategoriaPorId ),
    validarCampos
], crearProducto);

// Actualizar - privado - registro por id
router.put('/:id', [
    validarJWT,
    check('id').custom( existeProductoPorId ),
    validarCampos // Es posarà sempre amb un check
], actualizarProducto);

// Borrar producto - Admin
router.delete('/:id', [
    validarJWT,
    esAdminRole,
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom( existeProductoPorId ),
    validarCampos
], borrarProducto);


module.exports = router;