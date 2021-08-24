const { response } = require("express");
const { Categoria } = require('../models/index');
const Usuario = require('../models/usuario');

// Obtener categorías - paginado - total - populate

const obtenerCategorias = async(req, res = response) => {

    const { limite = 5, desde = 0 } = req.query; // limite i desde seran valors enviats per URL -> ?limite=10&desde=5

    const [ total, categorias ] = await Promise.all([ // Total serà el countDocuments i usuarios el .find
        Categoria.countDocuments({ estado : true }),
        Categoria.find({ estado : true }) // Agafa tots els usuarios de la BD amb estado true
            .populate('usuario', 'nombre') // Utiltizem Populate per agfafar de l'atribut usuario que ve, el seu nom i el mostrem
            .skip(Number(desde))
            .limit(Number(limite))
    ]);

    res.json({
        total,
        categorias
    });

}

const obtenerCategoria = async(req, res = response) => {

    const { id } = req.params;

    const categoria = await Categoria.findById(id).populate('usuario', 'nombre'); // Tornem a utilitzar populate

    res.json({
        categoria
    });

}

// Obtener categoría - populate


const crearCategoria = async(req, res = response) => {

    const nombre = req.body.nombre.toUpperCase();

    const categoriaDB = await Categoria.findOne({nombre}); // Busca si ja existeix el nom que enviem pel body de la request

    if( categoriaDB ) { // Si ja existeix, enviem msg
        return res.status(400).json({
            msg: `La categoria ${categoriaDB.nombre}, ya existe`
        });
    }

    // Generar la data a guardar
    const data = {
        nombre, 
        usuario: req.usuario._id // Assignem a l'atribut usuario el valor que sempre envia MongoDB que és el _id, ja que anteriorment, a routes, cridem el mètide de validar-jwt on busca l'usuari pel token enviat. Llavors, així podem agafar la id de l'usuari que fa la petició
    }

    const categoria = new Categoria(data); // Creem nou objecte categoria

    // Guardar DB
    await categoria.save();

    res.status(201).json(categoria); // Retornem msg satisfactori

}

// actualizarCategoria
const actualizarCategoria = async(req, res = response) => {

    const { id } = req.params; // Agafem la id enviada des dels params, la id no s'envia pel body
    const { estado, usuario, ...data } = req.body; // ...resto és la resta que vingui pel body
    // _id és un param que s'envia sol al body agafant la ID de req.params
    
    data.nombre = data.nombre.toUpperCase();
    data.usuario = req.usuario._id;

    const categoria = await Categoria.findByIdAndUpdate( id, data ); // Busca a la BD la ID que s'envia per paràmetre si coincideix amb alguna de la BD i actualitza el contingut amb la informació enviada pel body

    res.json(categoria);

}


// borrarCategoria - estado:false
const borrarCategoria = async(req, res = response) => {

    const { id } = req.params;

    const categoria = await Categoria.findByIdAndUpdate(id, { estado : false }); // Se li canvia l'estat a false

    res.json({
        categoria
    });

}

module.exports = {
    crearCategoria: crearCategoria,
    obtenerCategorias: obtenerCategorias,
    obtenerCategoria: obtenerCategoria,
    actualizarCategoria: actualizarCategoria,
    borrarCategoria: borrarCategoria
}