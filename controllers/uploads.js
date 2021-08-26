const path = require('path'); // Propi de Node
const fs = require('fs'); // Propi de Node

const cloudinary = require('cloudinary').v2; // npm i couldinary
cloudinary.config( process.env.CLOUDINARY_URL );

const { response } = require("express");
const { subirArchivo } = require('../helpers/index');

const { Usuario, Producto } = require('../models');

const cargarArchivo = async(req, res = response) => {

    console.log(req.files) // req-files - AL postman Body - form-data i posem l'arxiu

    try {
        // Imágenes
        //const pathCompleto = await subirArchivo( req.files, ['txt','md'], 'textos' ); // Si volem que vagin a textos
        const pathCompleto = await subirArchivo( req.files, undefined, 'imgs' ); // Undefined perquè utiltizarem els valors per defecte de la funció  
        res.json({
            nombre: pathCompleto
        })
    } catch (msg) {
        res.status(400).json({msg});
    }
   
}

const actualizarImagen = async(req, res = response) => {

    const { id, coleccion } = req.params; // Agafem els valors que s'envien des de la ruta uploads.js

    let modelo;

    switch ( coleccion ) {
        case 'usuarios':
            modelo = await Usuario.findById(id);    
            if( !modelo ) {
                return res.status(400).json({
                    msg: `No existe un usuario con el id ${id}`
                })
            }
        break;

        case 'productos':
            modelo = await Producto.findById(id);    
            if( !modelo ) {
                return res.status(400).json({
                    msg: `No existe un producto con el id ${id}`
                })
            }
        break;
    
        default:
            return res.status(500).json({ msg: 'Se me olvidó validar esto' })
    }

    // Limpiar imagenes previas
    if ( modelo.img ) { // Atribut img del Model
        // Borrar imatge del servidor
        const pathImagen = path.resolve( __dirname, '../uploads', coleccion, modelo.img );
        if( fs.existsSync(pathImagen)) {
            fs.unlinkSync(pathImagen);
        }
    }

    const nombre = await subirArchivo( req.files, undefined, coleccion ); // Undefined perquè utiltizarem els valors per defecte de la funció   // El model de Producto i Usuarios tenen un atribut img 
    modelo.img = nombre;

    await modelo.save();

    res.json({
        modelo
    })

}

const actualizarImagenCloudinary = async(req, res = response) => {

    const { id, coleccion } = req.params; // Agafem els valors que s'envien des de la ruta uploads.js

    let modelo;

    switch ( coleccion ) {
        case 'usuarios':
            modelo = await Usuario.findById(id);    
            if( !modelo ) {
                return res.status(400).json({
                    msg: `No existe un usuario con el id ${id}`
                })
            }
        break;

        case 'productos':
            modelo = await Producto.findById(id);    
            if( !modelo ) {
                return res.status(400).json({
                    msg: `No existe un producto con el id ${id}`
                })
            }
        break;
    
        default:
            return res.status(500).json({ msg: 'Se me olvidó validar esto' })
    }

    // Limpiar imagenes previas
    if ( modelo.img ) { // Atribut img del Model
        const nombreArr = modelo.img.split('/'); // Separem el nom de la imatge per la / perquè ve tipus: (http://hola/nomImatge)
        const nombre = nombreArr[ nombreArr.length -1 ]; // Agafem el nomImatge
        const [ public_id ] = nombre.split('.'); // Separem la extensió (nomImagen.jpg). Desestructurant public_id que és un atribut que ve amb l'objecte Cloudinary. Igual que el secure_url més abaix

        cloudinary.uploader.destroy( public_id );
    }

    // Amb això i mitjançant el process.env amb l'usuari del nostre perfil de Cloudinary, pugem les imgs al servidor de Cloudinary
    const { tempFilePath } = req.files.archivo; // tempFilePath és un atribut que es desestructura de req.files.archivo
    const { secure_url } = await cloudinary.uploader.upload( tempFilePath ); // Desestructurem secure_url que és la url de la imatge que genera Cloudinary
    modelo.img = secure_url;

    await modelo.save();

    res.json({
        modelo
    })

}

const mostrarImagen = async(req, res = response) => {

    const { id, coleccion } = req.params; // Agafem els valors que s'envien des de la ruta uploads.js

    let modelo;

    switch ( coleccion ) {
        case 'usuarios':
            modelo = await Usuario.findById(id);    
            if( !modelo ) {
                return res.status(400).json({
                    msg: `No existe un usuario con el id ${id}`
                })
            }
        break;

        case 'productos':
            modelo = await Producto.findById(id);    
            if( !modelo ) {
                return res.status(400).json({
                    msg: `No existe un producto con el id ${id}`
                })
            }
        break;
    
        default:
            return res.status(500).json({ msg: 'Se me olvidó validar esto' })
    }

    // Limpiar imagenes previas
    if ( modelo.img ) { // Atribut img del Model
        // Borrar imatge del servidor
        const pathImagen = path.resolve( __dirname, '../uploads', coleccion, modelo.img );
        if( fs.existsSync(pathImagen)) {
            return res.sendFile( pathImagen ); // Ensenya l'imatge
        }
    } 

    // Si el producte o usuari que es busca no té imatge:
    const pathImagen = path.join( __dirname, '../assets/no-image.jpg' )
    res.sendFile( pathImagen );
}


module.exports = {
    cargarArchivo: cargarArchivo,
    actualizarImagen: actualizarImagen,
    mostrarImagen: mostrarImagen,
    actualizarImagenCloudinary: actualizarImagenCloudinary
}