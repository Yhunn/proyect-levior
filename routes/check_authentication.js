const allowedPermissionsForProducts = ['*'];
const allowedPermisionsForPOSupply = ['*','2'];
const allowedPermisionsForPOGenerator = ['*','1'];

const checkPermissions = (route) =>{
    return (req, res, next) =>{
        if (req.isAuthenticated()) {
            var userPermissions = String(req.user.role).split(',');
            
            switch (route) {
                case "products":
                    if(validPermisions(allowedPermissionsForProducts, userPermissions)){
                        return next();
                    }
                    break;
                case "po_supply":
                    if(validPermisions(allowedPermisionsForPOSupply, userPermissions)){
                        return next();
                    }
                    break;
                case "po_generator":
                    if(validPermisions(allowedPermisionsForPOGenerator, userPermissions)){
                        return next();
                    }
                    break;
                default:
                    break;
            }
    
            
        }
        res.redirect('/');
    }
}

function validPermisions(allowedPermisions, userPermisions){
    return allowedPermisions.some(permision => userPermisions.includes(permision));
}

module.exports = checkPermissions;