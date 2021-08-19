const { validationResult } = require('express-validator'); // npm i express-validator

const validarCampos = (req, res, next) => {
    const errors = validationResult(req); // validationResult és propi d'express-validator
    if(!errors.isEmpty()) {
        return res.status(400).json(errors);
    }

    next(); // Next es crida, si el middleware passa correctament. Com que tenim diverses validacions, s'ha de poasr
}


module.exports = {
    validarCampos: validarCampos
}