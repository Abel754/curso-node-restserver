const { response } = require("express")


const validarArchivoSubir = (req, res = response, next) => {

    // Codi agafat del exemple de Github. Documentació oficial
    if (!req.files || Object.keys(req.files).length === 0 || !req.files.archivo) {
        return res.status(400).json({
            msg: 'No hay archivos que subir - validarArchivoSubir'
        }); 
    }

    next();

}


module.exports = {
    validarArchivoSubir: validarArchivoSubir
}