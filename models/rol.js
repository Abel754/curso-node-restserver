
const { Schema, model } = require('mongoose');

const RoleSchema = Schema({
    rol: {
        type: String,
        required: [true, 'El rol es obligaotrio']
    }
});


module.exports = model('Role', RoleSchema); // Role és el nom que nosaltres li donem