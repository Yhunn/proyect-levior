const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', checkPermissionsForPOGenerator, (req, res) => {
    res.render("po_generator.ejs");
});

router.post('/save', (req, res) => {
    let { pName,
        shipTo,
        requis,
        model,
        desc,
        qnty,
        poID } = req.body;

    //DATABASE INSERT QUERY - FOR CATEGORY
    try {
        db.query(`INSERT INTO $1:name VALUES(default, $2, $3, $4, $5, $6, $7, $8, $9)`, ['po_toDeliver_provisional'
        , poID, pName, shipTo, requis, model, desc, qnty, false])
            .then(response => {
                console.log("query successful, data added to database");
            });
    } catch (err) {
        console.warn("Unable to insert into database");
    }
});

//MIDDLEWARE FUNCTIONS
function checkPermissionsForPOGenerator(req, res, next) {
    if(req.isAuthenticated()){
        const allowedPermisionsForPOGenerator = ['*','1'];
        var userPermissions = String(req.user.role).split(',');

        if(allowedPermisionsForPOGenerator.some(permision=> userPermissions.includes(permision))){
            return next();
        }
    }
    res.redirect('/');
}

module.exports = router;