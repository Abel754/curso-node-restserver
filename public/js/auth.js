
const miFormulario = document.querySelector('form');

// La variable url serà l'url on ens trobem, si té localhost, utiltizem aquella URL, si no, utilitzem la del Heroku
var url = ( window.location.hostname.includes('localhost') )
? 'http://localhost:8080/api/auth/'
: 'https://restserver-node-abel.herokuapp.com/api/auth/'


miFormulario.addEventListener('submit', ev => {

    ev.preventDefault();

    const formData = {};

    for( let elements of miFormulario.elements ) {
        if( elements.namespaceURI.length > 0 ) {
            formData[elements.name] = elements.value
        }
    }

    // console.log(formData) -> Mostra correo: value password: value
    
    fetch(url + 'login', { // Fa una solicitud HTTP (la qual serveix en Postman) a /api/auth/login i verifica si coincideix amb algun usuari de la BD
        method: 'POST',
        body: JSON.stringify(formData),
        headers: { 'Content-Type': 'application/json' }
    })
    .then(resp => resp.json())
    .then(({msg, token}) => { // Extraiem el json web token de la resposta i msg si succeeix un error
        if( msg ) {
            return console.error( msg );
        }
        localStorage.setItem('token', token); // Opcion del navegador de F12 - localStorage. Guardem el token allà
        window.location = 'chat.html';
    })
    .catch(err => {
        console.log(err)
    })

})


// Copy paste de la url del Google
function onSignIn(googleUser) {
    // var profile = googleUser.getBasicProfile();
    // console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
    // console.log('Name: ' + profile.getName());
    // console.log('Image URL: ' + profile.getImageUrl());
    // console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.


    var id_token = googleUser.getAuthResponse().id_token; // Acaba copy paste
    const data = { id_token };

    fetch( url + 'google', { // Fetch fa una solicitud HTTP (Postman). Fa solicitud a la URL, metod POST, headers han d'anar així perquè és JSON, i passem el token a JSON
        method: 'POST',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify( data )
        } )
        .then( resp => resp.json() ) // Passem la resposta a JSON
        .then( ({ token }) => { // Agafem el token de la resposta
            localStorage.setItem('token',token);
            window.location = 'chat.html';
            console.log(token)
        })
        .catch( console.log );
}


function signOut() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
    console.log('User signed out.');
    });
}