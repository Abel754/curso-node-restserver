const express = require('express');
const cors = require('cors');
const { dbConnection } = require('../database/config');

class Server {
    
    constructor() {
        this.app = express();
        this.port = process.env.PORT;

        this.paths = {
            auth: '/api/auth',
            buscar: '/api/buscar',
            productos: '/api/productos',
            categorias: '/api/categorias',
            usuarios: '/api/usuarios',
        }

        // Conectar BD
        this.conectarDB();

        // Middlewares
        this.middlewares();

        // Rutas de mi aplicación
        this.routes();
    }

    async conectarDB() {
        await dbConnection();
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

        this.app.use(this.paths.auth, require('../routes/auth'));
        this.app.use(this.paths.buscar, require('../routes/buscar'));
        this.app.use(this.paths.productos, require('../routes/productos'));
        this.app.use(this.paths.categorias, require('../routes/categorias'));
        this.app.use(this.paths.usuarios, require('../routes/user'));     

    }

    listen() {
        this.app.listen(this.port, () => {
            console.log('Servidor corriendo en puerto' , this.port);
        })
    }

}


module.exports = Server;