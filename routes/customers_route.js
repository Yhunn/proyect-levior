const express = require('express');
const router = express.Router();
const db = require('../db');
const checkPermissions = require('./check_authentication');
router.use(checkPermissions("customers"));

router.get('/', (req, res) => {
    res.render('customers.ejs');
});

router.get('/getData', (req, res) => {
    db.any(`SELECT * FROM customers ORDER BY "id" ASC`)
    .then(rows => {
        res.json(rows);
    })
    .catch(error => {
        console.log(error);
    });
});

router.get('/getCities', (req, res) => {
    db.any(`SELECT "id", "office_name" FROM office_locations WHERE "id">1 ORDER BY id ASC`)
    .then(rows => {
        res.json(rows);
    })
    .catch(error => {
        console.log(error);
    });
});

router.post('/save', (req, res) =>{
    let { name, address, account, currency, email, phone, city } = req.body;
    try {
        db.any(`INSERT INTO customers
            VALUES(DEFAULT, $1, $2, $3, $4, $5, $6, $7:raw, true)`,
            [name, address, account, currency, email, phone, city])
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

router.post('/change', (req, res) =>{
    console.log(req.body);
    res.redirect('back');
});

router.post('/changeStatus', (req,res) =>{
    let { id, status } = req.body;
    try {
        db.any(`UPDATE customers SET status=$2 WHERE id=$1 `,
            [id, status])
            .then(response => {
                res.redirect('back');
            })
            .catch(error => {
                console.log(error);
            });
    } catch (e) {
        console.warn("Unable to update database");
    }
});

module.exports = router;