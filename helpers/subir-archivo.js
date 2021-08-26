const path = require('path'); // És de Node. Ajuda a pujar arxius
const { v4: uuidv4 } = require('uuid');

const subirArchivo = ( files, extensionesValidas = ['png','jpg','jpeg','gif'], carpeta = '' ) => {

    return new Promise( (resolve, reject) => {

        const { archivo } = files;
        const nombreCortado = archivo.name.split('.'); // Talla l'arxiu i ho separa des de l'extensió
        const extension = nombreCortado[nombreCortado.length - 1]; // Per agafar la extensió. Ja que si l'arxiu conté molts punts, agafarà el del final que sempre és l'extensió
        
        // Validar la extensión
        if( !extensionesValidas.includes( extension ) ) { // Si és una de les extensions permitides
            return reject(`La extensión ${ extension } no es permitida - ${ extensionesValidas }`);
        }
    
        const nombreArchivo = uuidv4() + '.' + extension;
        const uploadPath = path.join( __dirname, '../uploads/', carpeta, nombreArchivo  ); // Sempre és name perquè ve així a l'objecte de quan es puja l'arxiu
    
        archivo.mv(uploadPath, function(err) {
            if (err) {
                return reject(err);
            }
    
            resolve(uploadPath);
        }); 
            
    })

}


module.exports = {
    subirArchivo: subirArchivo
}