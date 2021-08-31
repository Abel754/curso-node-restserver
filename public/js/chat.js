// La variable url serà l'url on ens trobem, si té localhost, utiltizem aquella URL, si no, utilitzem la del Heroku
var url = ( window.location.hostname.includes('localhost') )
? 'http://localhost:8080/api/auth/'
: 'https://restserver-node-abel.herokuapp.com/api/auth/'

let usuario = null;
let socket = null;

// Referencias HTML
const txtUid = document.querySelector('#txtUid');
const txtMensaje = document.querySelector('#txtMensaje');
const ulUsuarios = document.querySelector('#ulUsuarios');
const ulMensajes = document.querySelector('#ulMensajes');
const btnSalir = document.querySelector('#btnSalir');

// Validar el token del localstorage
const validarJWT = async() => {

    const token = localStorage.getItem('token') || '';

    if( token.length <= 10 ) { // Serà invàlid
        window.location = 'index.html';
        throw new Error('No hay token en el servidor');
    }

    const resp = await fetch( url, { // Crida la URL /api/auth on renova el token
        headers: { 'x-token': token }
    });

    const { usuario: userDB, token: tokenDB } = await resp.json(); // Usuario serà de la resposta el que porta totes les dades de l'usuari -> correo, img, nombre, rol, etc i token serà el nou token generat
    localStorage.setItem('token', tokenDB); // Assigna al localStorage del navegador el nou token
    usuario = userDB;
    document.title = usuario.nombre;

    await conectarSocket();

}

const conectarSocket = async() => {

    socket = io({
        'extraHeaders': { // S'ha d'escriure així tal qual segons la documentació
            'x-token': localStorage.getItem('token')
        }
    });

    socket.on('connect', () => {
        console.log('Sockets online')
    });

    socket.on('disconnect', () => {
        console.log('Sockets offline')
    });

    socket.on('recibir-mensajes', dibujarMensajes);

    socket.on('usuarios-activos', dibujarUsuarios);

    socket.on('mensaje-privado', (payload) => {
        console.log('Privado ', payload);
    });

}

// Mostrarà els usuaris que hi hagi connectats mitjançant HTML
const dibujarUsuarios = ( usuarios = [] ) => {

    let usersHtml = '';
    usuarios.forEach( ({ nombre, uid }) => {
        usersHtml += `
            <li>
                <p>
                    <h5 class="text-success">${nombre}</h5>
                    <span class="fs-6 text-muted">${uid}</span>
                </p>
            </li>
        `;
    });

    ulUsuarios.innerHTML = usersHtml;

}

// Mostrarà els missatges que hi hagi enviats mitjançant HTML
const dibujarMensajes = ( mensajes = [] ) => {

    let mensajesHTML = '';
    mensajes.forEach( ({ nombre, mensaje }) => {
        mensajesHTML += `
            <li>
                <p>
                    <span class="text-primary">${nombre}</span>
                    <span>${ mensaje }</span>
                </p>
            </li>
        `;
    });

    ulMensajes.innerHTML = mensajesHTML;

}

txtMensaje.addEventListener('keyup', ({ keyCode }) => { // input del missatge (emensaje) Quan succeeixi aquest event, keyCode és el codi de la tecla que es presiona

    const mensaje = txtMensaje.value;
    const uid = txtUid.value; // txtUid és l'altre input (id)

    if( keyCode !== 13 ) { // Si és tecla enter
        return;
    }

    if( mensaje.length === 0 ) {
        return;
    }

    socket.emit('enviar-mensaje', {mensaje, uid}); // event a controller.js

    txtMensaje.value = '';

});

const main = async() => {

    // Validar JWT
    await validarJWT();

}


main();

