const express = require('express');
const router = express.Router();
const db = require('../db');
const checkPermissions = require('./check_authentication');
router.use(checkPermissions("po_supply"));

router.get('/', (req,res)=>{
    res.render("po_supply.ejs", { userOffice: req.user.office, userID: req.user.id, userName: req.user.name });
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

router.post('/save', (req,res)=>{
    console.log(req.body);
});

module.exports = router;