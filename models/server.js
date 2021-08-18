const express = require('express');
const cors = require('cors');

class Server {
    
    constructor() {
        this.app = express();
        this.port = process.env.PORT;
        this.usuariosPath = '/api/usuarios';

        // Middlewares
        this.middlewares();

        // Rutas de mi aplicación
        this.routes();
    }

    middlewares() {

        // CORS npm i cors (una llibreria de middleware)
        this.app.use(cors());

        // Parseo y lectura del body
        this.app.use(express.json()); // Qualsevol informació que vingui a la ruta, l'agafarà i la passarà a JSON

        // Directorio público
        this.app.use(express.static('public')); // Use és específic de middlewares

    }

    routes() {

        this.app.use(this.usuariosPath, require('../routes/user'));

    }

    listen() {
        this.app.listen(this.port, () => {
            console.log('Servidor corriendo en puerto' , this.port);
        })
    }

}


module.exports = Server;