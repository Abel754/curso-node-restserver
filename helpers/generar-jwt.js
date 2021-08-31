const jwt = require('jsonwebtoken'); // npm i jsonwebtoken
const { Usuario } = require('../models');

const generarJWT = (uid = '') => {

    return new Promise( (resolve, reject) => {

        const payload = { uid };

        jwt.sign(payload, process.env.SECRETORPRIVATEKEY, { // Per generar un json web token
            expiresIn: '4h' // Quan expirarà
        }, (err, token) => {
            if(err) {
                console.log(err);
                reject('No se pudo generar el token');
            } else {
                resolve(token); // S'envia el token
            }
        })
        // Public key haurà de ser amagat per més seguretat

    })

}

const comprobarJWT = async( token = '' ) => {

    try {
        if( token.length < 10 ) {
            return null;
        }

        const { uid } = jwt.verify( token, process.env.SECRETORPRIVATEKEY ); // Li passem un token per verificar un que existeixi i agafem el uid obtés de l'usuari que coincideix amb el token json en la resposta
        const usuario = await Usuario.findById( uid );

        if( usuario ) {
            if( usuario.estado ) {
                return usuario;
            } else {
                return null;
            }
        } else {
            return null;
        }

    } catch (error) {
        return null;
    }

}



module.exports = {
    generarJWT: generarJWT,
    comprobarJWT: comprobarJWT
}