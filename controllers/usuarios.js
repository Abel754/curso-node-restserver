const {response, request} = require('express');
const bcryptjs = require('bcryptjs'); // npm i bcryptjs per hashear passwords
const Usuario = require('../models/usuario');

const usuariosGet = async(req = request, res = response) => {

    const { limite = 5, desde = 0 } = req.query; // limite i desde seran valors enviats per URL -> ?limite=10&desde=5
    // const usuarios = await Usuario.find({ estado = true }) // Agafa tots els usuarios de la BD amb estado true
    //     .skip(Number(desde))
    //     .limit(Number(limite)); // Serà un valor passat per paràmetre, el límit d'usuaris que volem mostrar
    
    // const total = await Usuario.countDocuments({ estado = true }); // Compta el número de registres que hi ha a la BD

    // El que tenim adalt es pot fer tot en un amb una Promise de la seg manera:
    const [ total, usuarios ] = await Promise.all([ // Total serà el countDocuments i usuarios el .find
        Usuario.countDocuments({ estado : true }),
        Usuario.find({ estado : true }) // Agafa tots els usuarios de la BD amb estado true
            .skip(Number(desde))
            .limit(Number(limite))
    ]);

    res.json({
        total,
        usuarios
    });
}

const usuariosPost = async(req, res = response) => {

    const {nombre, correo, password, rol} = req.body; // Així agafo la informació que s'envia pel body
    const usuario = new Usuario({nombre, correo, password, rol});

    // Encriptar la password
    const salt = bcryptjs.genSaltSync(); // Utilitzem el paquet bcryptjs per encriptar la password. S'han de fer aquests dos passos
    usuario.password = bcryptjs.hashSync(password, salt);

    // Guardar en BD
    await usuario.save(); // És de mongoose el .save

    res.json({
        usuario
    });
}

const usuariosPut = async(req, res = response) => {

    const {id} = req.params; // Agafem la id enviada des dels params, la id no s'envia pel body
    const { _id, password, google, ...resto } = req.body; // ...resto és la resta que vingui pel body
    // _id és un param que s'envia sol al body agafant la ID de req.params

    // Validar contra base de datos
    if( password ) {
        // Encriptar la password
        const salt = bcryptjs.genSaltSync(); // Utilitzem el paquet bcryptjs per encriptar la password. S'han de fer aquests dos passos
        resto.password = bcryptjs.hashSync(password, salt);
    }

    const usuario = await Usuario.findByIdAndUpdate( id, resto ); // Busca a la BD la ID que s'envia per paràmetre si coincideix amb alguna de la BD i actualitza el contingut amb la informació enviada pel body

    res.json(usuario);
}

const usuariosPatch = (req, res = response) => {
    res.status(200).json({
        msg: "patch API - controlador"
    });
}

const usuariosDelete = async(req, res = response) => {

    const { id } = req.params;

    const usuario = await Usuario.findByIdAndUpdate(id, { estado : false }); // Se li canvia l'estat a false
    const usuarioAutenticado = req.usuario;

    res.json({
        usuario,
        usuarioAutenticado
    });
}



module.exports = {
    usuariosGet: usuariosGet,
    usuariosPost: usuariosPost,
    usuariosPut: usuariosPut,
    usuariosPatch: usuariosPatch,
    usuariosDelete: usuariosDelete
}