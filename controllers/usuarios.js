const {response, request} = require('express');

const usuariosGet = (req = request, res = response) => {

    const {q, nombre = 'No Name', apikey, page = 1, limit} = req.query; // Agafa els valors de la URL que van després de l'interrogant -> ?valor=hola&valor2=hola2

    res.json({
        msg: "get API - controlador",
        q,
        nombre,
        apikey,
        page,
        limit
    });
}

const usuariosPost = (req, res = response) => {

    const {nombre, edad} = req.body; // Així agafo la informació que s'envia pel body

    res.json({
        msg: "post API - controlador",
        nombre,
        edad
    });
}

const usuariosPut = (req, res = response) => {

    const id = req.params.id; // Agafem la id enviada des del Model

    res.json({
        msg: "put API - controlador",
        id: id
    });
}

const usuariosPatch = (req, res = response) => {
    res.status(200).json({
        msg: "patch API - controlador"
    });
}

const usuariosDelete = (req, res = response) => {
    res.json({
        msg: "delete API - controlador"
    });
}



module.exports = {
    usuariosGet: usuariosGet,
    usuariosPost: usuariosPost,
    usuariosPut: usuariosPut,
    usuariosPatch: usuariosPatch,
    usuariosDelete: usuariosDelete
}