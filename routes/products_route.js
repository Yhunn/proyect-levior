const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', checkPermissionsForProducts, (req, res) => {
    res.render('products.ejs');
});

router.post('/save', (req, res) => {
    let { category, dlc, brand, specification, subsidiary, publicCost, unit } = req.body;
    try {
        db.any(`INSERT INTO products
            VALUES(DEFAULT, $1, $2, $3, $4, $5:raw, $6:raw, $7)`,
            [category, dlc, brand, specification, subsidiary, publicCost, unit])
            .then(response => {
                res.redirect('back');
            })
            .catch(error => {
                console.log(error);
            });
    } catch (e) {
        console.warn("Unable to insert into database");
    }
});

function checkPermissionsForProducts(req, res, next) {
    if (req.isAuthenticated()) {
        const allowedPermisionsForPOSupply = ['*'];
        var userPermissions = String(req.user.role).split(',');

        if (allowedPermisionsForPOSupply.some(permision => userPermissions.includes(permision))) {
            return next();
        }
    }
    res.redirect('/');
}

module.exports = router;