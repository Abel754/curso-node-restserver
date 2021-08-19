
const {Schema, model} = require('mongoose');

const UsuarioSchema = Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio']
    },
    correo: {
        type: String,
        required: [true, 'El correo es obligatorio'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'La contraseña es obligatoria']
    },
    img: {
        type: String
    },
    rol: {
        type: String,
        required: true,
        emun: ['ADMIN_ROLE', 'USER_ROLE'] // Només permetrà aquests dos
    },
    estado: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false // Com a predeterminat, no es crearà compte de Google
    }
});

// Quan fem un postman, realment guardarà tots els valors però no mostrarà la password i el __v del Postman
UsuarioSchema.methods.toJSON = function() {
    const { __v, password, ...usuario } = this.toObject(); // Agafa __v i password, i la resta s'emmagatzemen en usuario
    return usuario;
}


module.exports = model('Usuario', UsuarioSchema);