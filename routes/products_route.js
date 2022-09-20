const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', checkPermissionsForProducts, (req,res) =>{
    res.render('products.ejs');
});

function checkPermissionsForProducts(req, res, next) {
    if(req.isAuthenticated()){
        const allowedPermisionsForPOSupply = ['*'];
        var userPermissions = String(req.user.role).split(',');

        if(allowedPermisionsForPOSupply.some(permision=> userPermissions.includes(permision))){
            return next();
        }
    }
    res.redirect('/');
}

module.exports = router;