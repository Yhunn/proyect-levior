const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', (req,res)=>{
    var poToDeliverList = [];
    try {
        db.query(`SELECT MIN("id") AS "id", "identifierOrder" FROM "po_toDeliver_provisional" GROUP BY "identifierOrder" ORDER BY "id" ASC`)
            .then(rows => {
                rows.forEach(row =>{
                    poToDeliverList.push(row.identifierOrder);
                });
                res.render("po_query.ejs",{poList: poToDeliverList});
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

module.exports = router;