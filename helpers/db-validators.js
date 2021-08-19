const Role = require('../models/rol');
const Usuario = require('../models/usuario');

const esRolValido = async(rol = '') => { // Rol és el camp de la BD, farà una validació personalitzada, agafant el rol, que és enviat pel body i busca un registre que sigui igual a l'enviat per paràmetre. Exemple (USER_ROLE està en la BD? Sí) 
    const existeRol = await Role.findOne({rol});
    if(!existeRol) {
        throw new Error(`El rol ${rol} no está registrado en la BD`)
    }
}

// Verificar si el correo existe
// Creem una constant que busca en la instància Usuario si hi ha un correu igual al que es passa per paràmetre
const emailExiste = async( correo = '' ) => {

    // Verificar si el correo existe
    const existeEmail = await Usuario.findOne({ correo });
    if ( existeEmail ) {
        throw new Error(`El correo: ${ correo }, ya está registrado`);
    }
}

const existeUsuarioPorId = async( id ) => {
    const existeUsuario = await Usuario.findById(id);
    if( !existeUsuario ) {
        throw new Error(`El id ${id} no existe`);
    }
} 



module.exports = {
    esRolValido: esRolValido,
    emailExiste: emailExiste,
    existeUsuarioPorId: existeUsuarioPorId
}