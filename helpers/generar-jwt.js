const jwt = require('jsonwebtoken'); // npm i jsonwebtoken

const generarJWT = (uid = '') => {

    return new Promise( (resolve, reject) => {

        const payload = { uid };

        jwt.sign(payload, process.env.SECRETORPRIVATEKEY, { // Per generar un jason web token
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



module.exports = {
    generarJWT: generarJWT
}