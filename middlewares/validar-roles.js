const { response } = require("express")


const esAdminRole = (req, res = response, next) => {

    if( !req.usuario ) {
        return res.status(500).json({
            msg: 'Se quiere verificar el rol sin validar el token primero'
        })
    }

    const { rol, nombre } = req.usuario;

    if( rol !== 'ADMIN_ROLE' ) {
        return res.status(401).json({
            msg: `${nombre} no es administrador - no puede hacer esto`
        })
    }

    next();

}

const tieneRole = ( ...roles ) => { // Tot el qua la persona enviï amb paràmetres al cridar el metode, estarà en roles

    return (req, res = response, next) => {

        if( !req.usuario ) {
            return res.status(500).json({
                msg: 'Se quiere verificar el rol sin validar el token primero'
            })
        }

        if( !roles.includes( req.usuario.rol ) ) { // Si no inclou un dels rols que s'envien per paràmetre, donarà error
            return res.status(401).json({
                msg: `El servicio requiere uno de estos roles ${roles}`
            })
        }

        next();
    }

}



module.exports = {
    esAdminRole: esAdminRole,
    tieneRole: tieneRole
}