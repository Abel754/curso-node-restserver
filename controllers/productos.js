const { response } = require("express");
const { Producto } = require('../models/index');
const Usuario = require('../models/usuario');

// Obtener productos - paginado - total - populate

const obtenerProductos = async(req, res = response) => {

    const { limite = 5, desde = 0 } = req.query; // limite i desde seran valors enviats per URL -> ?limite=10&desde=5

    const [ total, productos ] = await Promise.all([ // Total serà el countDocuments i usuarios el .find
        Producto.countDocuments({ estado : true }),
        Producto.find({ estado : true }) // Agafa tots els usuarios de la BD amb estado true
            .populate('usuario', 'nombre') // Utiltizem Populate per agfafar de l'atribut usuario que ve, el seu nom i el mostrem
            .populate('categoria', 'nombre') // Utiltizem Populate per agfafar de l'atribut usuario que ve, el seu nom i el mostrem
            .skip(Number(desde))
            .limit(Number(limite))
    ]);

    res.json({
        total,
        productos
    });

}

const obtenerProducto = async(req, res = response) => {

    const { id } = req.params;

    const producto = await Producto.findById(id).populate('usuario', 'nombre').populate('categoria', 'nombre'); // Tornem a utilitzar populate

    res.json({
        producto
    });

}

// Obtener categoría - populate


const crearProducto = async(req, res = response) => {

    const { estado, usuario, ...body } = req.body; // treiem estado i usuario perquè no ahn de venir al body

    const productoDB = await Producto.findOne({nombre: req.body.nombre}); // Busca si ja existeix el nom que enviem pel body de la request

    if( productoDB ) { // Si ja existeix, enviem msg
        return res.status(400).json({
            msg: `El producto ${productoDB.nombre}, ya existe`
        });
    }

    // Generar la data a guardar
    const data = {
        ...body,
        nombre: body.nombre.toUpperCase(), 
        usuario: req.usuario._id, // Assignem a l'atribut usuario el valor que sempre envia MongoDB que és el _id, ja que anteriorment, a routes, cridem el mètide de validar-jwt on busca l'usuari pel token enviat. Llavors, així podem agafar la id de l'usuari que fa la petició
    }

    const producto = new Producto(data); // Creem nou objecte producto

    // Guardar DB
    await producto.save();

    res.status(201).json(producto); // Retornem msg satisfactori

}

// actualizarProducto
const actualizarProducto = async(req, res = response) => {

    const { id } = req.params; // Agafem la id enviada des dels params, la id no s'envia pel body
    const { estado, usuario, ...data } = req.body; // ...resto és la resta que vingui pel body
    // _id és un param que s'envia sol al body agafant la ID de req.params
    
    if( data.nombre ) {
        data.nombre = data.nombre.toUpperCase();
    }
    
    data.usuario = req.usuario._id;

    const producto = await Producto.findByIdAndUpdate( id, data ); // Busca a la BD la ID que s'envia per paràmetre si coincideix amb alguna de la BD i actualitza el contingut amb la informació enviada pel body

    res.json(producto);

}


// borrarProducto - estado:false
const borrarProducto = async(req, res = response) => {

    const { id } = req.params;

    const producto = await Producto.findByIdAndUpdate(id, { estado : false }); // Se li canvia l'estat a false

    res.json({
        producto
    });

}

module.exports = {
    crearProducto: crearProducto,
    obtenerProductos: obtenerProductos,
    obtenerProducto: obtenerProducto,
    actualizarProducto: actualizarProducto,
    borrarProducto: borrarProducto
}