const express = require('express');
const router = express.Router();
const db = require('../../db');

//GET ALL
router.get('/', (req,res) =>{
    db.any("SELECT * FROM purchase_orders")
    .then(rows => {
        res.json(rows);
    })
    .catch(error => {
        res.status(500).send(error);
    });
});

//FROM USER OFFICE
router.get('/office/:id', (req, res) => {
    const officeId = req.params.id;
    let date_ob = new Date();
    let year = date_ob.getFullYear();
    db.any('SELECT * FROM purchase_orders WHERE office=$1:raw ORDER BY "registry_3" ASC',
    [officeId, year, year-1])
    .then(rows => {
        res.json(rows);
    })
    .catch(error => {
        res.status(500).send(error);
    });
});

//GET ONE
router.get('/:id', (req,res) =>{
    const id = req.params.id
    db.any("SELECT * FROM purchase_orders WHERE id = $1", [id])
    .then(rows => {
        res.json(rows);
    })
    .catch(error => {
        res.status(500).send(error);
    });
});

//UPDATE ONE
router.post('/:id', (req, res) =>{
    
});

//POST ONE
router.post('/', (req, res) =>{
    console.log(req.body);
});


module.exports = router;