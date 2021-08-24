const { response } = require("express");
const { ObjectId } = require("mongoose").Types;

const { Usuario, Categoria, Producto } = require('../models');

const coleccionesPermitidas = [
    'usuarios',
    'categorias',
    'productos',
    'roles'
]

const buscarUsuarios = async(termino = '', res = response ) => {

    const esMongoID = ObjectId.isValid( termino ); // TRUE
    
    if( esMongoID ) {
        const usuario = await Usuario.findById(termino);
        return res.json({
            results: ( usuario ) ? [ usuario ] : [] // Si l'usuari existeix, retorna un array amb l'usuari. Si no, retorna un array buit
        })
    }

    // Utilitzarem una expressió regular per evitar que en comptes de treure el resultat si posem test1, també el tregui posant minúscules o majúscules
    // Només hem de posar la 'i'
    const regex = new RegExp( termino, 'i' ) // RegExp és de JS

    const usuarios = await Usuario.find({ 
        $or: [{ nombre: regex }, { correo: regex }], // Instrucció de Mongo, que el nom contingui el que hi ha a la variable regex o que el correu ho contingui. És nombre i correo perquè així es diuen a la BD
        $and: [{ estado: true }] // Han de complir això obligatòriament
    });

    res.json({
        results: usuarios
    });

}

const buscarCategorias = async(termino = '', res = response ) => {

    const esMongoID = ObjectId.isValid( termino ); // TRUE
    
    if( esMongoID ) {
        const categoria = await Categoria.findById(termino).populate('categoria', 'nombre'); // Mostrarà el nom de la categoria
        return res.json({
            results: ( categoria ) ? [ categoria ] : [] // Si l'usuari existeix, retorna un array amb l'usuari. Si no, retorna un array buit
        })
    }

    // Utilitzarem una expressió regular per evitar que en comptes de treure el resultat si posem test1, també el tregui posant minúscules o majúscules
    // Només hem de posar la 'i'
    const regex = new RegExp( termino, 'i' ) // RegExp és de JS

    const categorias = await Categoria.find({ 
        $or: [{ nombre: regex }], // Instrucció de Mongo, que el nom contingui el que hi ha a la variable regex o que el correu ho contingui. És nombre i correo perquè així es diuen a la BD
        $and: [{ estado: true }] // Han de complir això obligatòriament
    }).populate('categoria', 'nombre');

    res.json({
        results: categorias
    });

}

const buscarProductos = async(termino = '', res = response ) => {

    const esMongoID = ObjectId.isValid( termino ); // TRUE
    
    if( esMongoID ) {
        const producto = await Producto.findById(termino).populate('producto', 'nombre');
        return res.json({
            results: ( producto ) ? [ producto ] : [] // Si l'usuari existeix, retorna un array amb l'usuari. Si no, retorna un array buit
        })
    }

    // Utilitzarem una expressió regular per evitar que en comptes de treure el resultat si posem test1, també el tregui posant minúscules o majúscules
    // Només hem de posar la 'i'
    const regex = new RegExp( termino, 'i' ) // RegExp és de JS

    const productos = await Producto.find({ 
        $or: [{ nombre: regex }], // Instrucció de Mongo, que el nom contingui el que hi ha a la variable regex o que el correu ho contingui. És nombre i correo perquè així es diuen a la BD
        $and: [{ estado: true }] // Han de complir això obligatòriament
    }).populate('producto', 'nombre');

    res.json({
        results: productos
    });

}

const buscar = ( req, res = response ) => {

    const { coleccion, termino } = req.params; // Params és el que ve en localhost/coleccion/termino

    if( !coleccionesPermitidas.includes(coleccion) ) {
        return res.status(400).json({
            msg: `Las colecciones permitidas son: ${coleccionesPermitidas}`
        })
    }

    switch (coleccion) {
        case 'usuarios':
            buscarUsuarios(termino, res);
        break;

        case 'categorias':
            buscarCategorias(termino, res);
        break;

        case 'productos':
            buscarProductos(termino, res);
        break;
    
        default:
            res.status(500).json({
                msg: 'Se me olvidó hacer esta búsqueda'
            })
    }

}


module.exports = {
    buscar
}