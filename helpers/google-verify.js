// Codi copiat de https://developers.google.com/identity/sign-in/web/backend-auth a la part de Using a Google API Client Library. On s'ha de fer un npm install de paquets primer

const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const googleVerify = async( id_token ) => {
  const ticket = await client.verifyIdToken({
      idToken: id_token,
      audience: process.env.GOOGLE_CLIENT_I,  // Specify the CLIENT_ID of the app that accesses the backend
      // Or, if multiple clients access the backend:
      //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
  });
  const { name: nombre, picture: img, email: correo } = ticket.getPayload(); // Desestructurem els únics valors que necessitarem del payload (el qual portarà molts)
  
  return { nombre, img, correo }; // Els retornem amb els nom que els indiquem

}


module.exports = {
    googleVerify: googleVerify
}