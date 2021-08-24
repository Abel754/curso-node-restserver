
const { Schema, model } = require('mongoose');

const CategoriaSchema = Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es obligaotrio'],
        unique: true
    },
    estado: {
        type: Boolean,
        default: true,
        required: true
    },
    usuario: {
        type: Schema.Types.ObjectId, // Serà un objecte nou d'Usuario
        ref: 'Usuario', // Serà la relació amb el model usuario. Se li dona aquest nom (Usuario) perquè en aquell model s'ha exportat amb aquest nom
        required: true
    }
});

// Quan fem un postman, realment guardarà tots els valors però no mostrarà la password i el __v del Postman
CategoriaSchema.methods.toJSON = function() {
    const { __v, estado, ...data } = this.toObject(); // Agafa __v i password, i la resta s'emmagatzemen en usuario
    return data;
}

module.exports = model('Categoria', CategoriaSchema); // Role és el nom que nosaltres li donem