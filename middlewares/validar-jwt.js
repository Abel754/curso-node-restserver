const { response } = require('express');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario');

const validarJWT = async(req = request, res = response, next) => {

    const token = req.header('x-token'); // A l'enviar la petició postman, x-token serà una clau o atribut dels headers de Postman 

    if( !token ) {
        return res.status(401).json({
            msg: 'No hay token en la petición'
        });
    }

    try {

        // Assignem a uid (key de Postman del body) la jsonwebtoken
        const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY); // Funció de jsonwebtoken, verifica si el token enviat per headers és igual que el de .env (que prèviament ha sigut modificar amb el mètode de login)
        
        // Leer el usuario que corresponde al uid
        const usuario = await Usuario.findById(uid);

        if( !usuario ) {
            return res.status(401).json({
                msg: 'Token no válido - Usuario no existe en BD'
            })
        }

        // Verificar si el uid del usuario que va a realizar la acción de eliminar tiene estado true (usuario no eliminado)
        if( !usuario.estado ) {
            return res.status(401).json({
                msg: 'Token no válido - Usuario estado false'
            })
        }

        req.usuario = usuario; // Emmagatzarem en la nova clau req.usuario la informació de l'usuari que borra a l'altre

        //next();
        
    } catch (error) {
        console.log(error);
        res.status(401).json({
            msg: 'Token no válido'
        })
    }

    next();

}



module.exports = {
    validarJWT: validarJWT
}