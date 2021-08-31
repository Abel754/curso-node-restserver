const { Socket } = require("socket.io");
const { comprobarJWT } = require("../helpers");
const { ChatMensajes } = require('../models');

const chatMensajes = new ChatMensajes();

const socketController = async( socket = new Socket(), io ) => {

    // Amb el io pots provocar els events a tothom, amb socket has de posar emit.braodcast per fer-ho

    const token = socket.handshake.headers['x-token']; // Manera d'accedir al token després de fer el mètode de conectarSocket de chat.js
    const usuario = await comprobarJWT(token); // Funció de generar-jwt.js

    if( !usuario ) {
        return socket.disconnect();
    }

    console.log('Se conectó', usuario.nombre)

    // Afegir l'usuari connectat
    chatMensajes.conectarUsuario( usuario );
    io.emit('usuarios-activos', chatMensajes.usuariosArr ); // No fa falta broadcast perquè io ja és a tothom
    socket.emit('recibir-mensajes', chatMensajes.ultimos10);

    // Connectar el socket a una sala especial
    socket.join( usuario.id );

    // Netejar quan algú es desconnecta
    socket.on('disconnect', () => {
        chatMensajes.desconectarUsuario( usuario.id );
        io.emit('usuarios-activos', chatMensajes.usuariosArr ); // No fa falta broadcast perquè io ja és a tothom
    })
    
    socket.on('enviar-mensaje', ({ uid, mensaje }) => {

        if( uid ) {
            // Missatge privat: Se li envia un msg privat a (to) la uid
            socket.to( uid ).emit('mensaje-privado', {de: usuario.nombre, mensaje} );
        } else {
            chatMensajes.enviarMensaje(usuario.id, usuario.nombre, mensaje);
            io.emit('recibir-mensajes', chatMensajes.ultimos10); // Aquest emit serà rebut a chat.js
        }

    })

}


module.exports = {
    socketController: socketController
}