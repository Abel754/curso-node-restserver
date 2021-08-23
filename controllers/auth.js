const { response } = require('express');
const bcryptjs = require('bcryptjs');
const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/generar-jwt');
const { googleVerify } = require('../helpers/google-verify');

const login = async(req, res = response) => {

    const { correo, password } = req.body;

    try {

        // Verificar si el email existe
        const usuario = await Usuario.findOne({correo}); // Busca del model un usuari amb el correu passat per paràmetre body
        if(!usuario) {
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - correo'
            })
        }

        // Si el usuario está activo
        if(!usuario.estado) {
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - estado false'
            })
        }

        // Verificar la contraseña
        const validPassword = bcryptjs.compareSync(password, usuario.password) // Compara la contrasenya que s'envia per paràmetre amb la de la BD (compareSnc funció de bcryptjs)
        if(!validPassword) {
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - password'
            })
        }

        // Generar el JWT
        const token = await generarJWT(usuario.id); // Cridem la funció (generar-jwt.js) i generem un jason web token amb la seva id

        res.json({
            usuario,
            token
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            msg: 'Hable con el administrador'
        });
    }

    

}

const googleSignin = async(req, res = response) => {

    const { id_token } = req.body; // Serà un paràmetre que enviem al body de Postman
    
    try { // Al fer login, executa aquest mètode
        const { correo, nombre, img } = await googleVerify( id_token ); // Desestructurem els 3 valors que s'han retornat en la funcuió GoogleVerify

        let usuario = await Usuario.findOne({ correo }); // Busca si el correu rebut ja existeix a la BD
        if( !usuario ) { // Si no, el crea
            const data = {
                nombre,
                correo,
                password: 'abc',
                img,
                google: true
            };

            usuario = new Usuario( data );
            await usuario.save(); // El guarda (express)
        }

        // Si el usuario existe en BD con estado en false
        if( !usuario.estado ) {
            return res.status(401).json({
                msg: 'Hable con el administrador - usuario bloqueado'
            });
        }

        // Generar el JWT
        const token = await generarJWT(usuario.id); // Cridem la funció (generar-jwt.js) i generem un jason web token amb la seva id 

        res.json({
            usuario,
            token
        }); 
    } catch (error) {
        res.status(400).json({
            msg: 'Token de Google no válido',
        })
    }

}



module.exports = {
    login: login,
    googleSignin: googleSignin
}