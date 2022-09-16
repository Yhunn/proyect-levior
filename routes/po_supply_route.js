const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', checkPermissions,(req,res)=>{
    var poToDeliverList = [];
    try {
        db.query(`SELECT MIN("id") AS "id", "identifierOrder" FROM "po_toDeliver_provisional" GROUP BY "identifierOrder" ORDER BY "id" ASC`)
            .then(rows => {
                rows.forEach(row =>{
                    poToDeliverList.push(row.identifierOrder);
                });
                res.render("po_supply.ejs",{poList: poToDeliverList});
            });
    } catch (err) {
        console.warn("Unable to insert into database");
    }
    
});

router.post('/populate', (req,res)=>{
    let { dataSearch } = req.body;
    dataSearch = dataSearch.trim() + '%';
    try {
        db.query(`SELECT * FROM $1:name WHERE $2:name like '$3:raw' ORDER BY id ASC`,[
            "po_toDeliver_provisional", "identifierOrder", dataSearch
        ]).then(rows =>{
            res.json(rows);
        });
    } catch (err) {
        console.warn("Unable to fetch from database");
    }
});

router.post('/save',(req,res)=>{
    console.log(req.body);
});

//MIDDLEWARE FUNCTIONS
function checkPermissions(req, res, next) {
    if(req.isAuthenticated()){
        const allowedPermisionsForPOSupply = ['*','2'];
        var userPermissions = String(req.user.role).split(',');

        if(allowedPermisionsForPOSupply.some(permision=> userPermissions.includes(permision))){
            return next();
        }
    }
    res.redirect('/');
}

module.exports = router;