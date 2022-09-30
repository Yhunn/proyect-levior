const express = require('express');
const router = express.Router();
const db = require('../db');
const checkPermissions = require('./check_authentication');
router.use(checkPermissions("products"));

router.get('/', (req, res) => {
    res.render('products.ejs');
});

router.get('/getData', (req, res) => {
    db.any('SELECT * FROM products ORDER BY "id" ASC')
    .then(rows => {
        res.json(rows);
    })
    .catch(error => {
        console.log(error);
    });
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

router.post('/change', (req,res) => {
    let { id, category, dlc, brand, specification, subsidiary, publicCost, unit } = req.body;
    try {
        db.any(`UPDATE products SET category=$1, dlc_or_es_model_no=$2,
        brand=$3, specification=$4, subsidiary=$5:raw, public_cost=$6:raw, measurement_unit=$7
        WHERE id = $8`,
            [category, dlc, brand, specification, subsidiary, publicCost, unit, id])
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

router.delete('/delete', (req,res) =>{
    let {id} = req.body;
    try {
        db.any(`DELETE FROM products WHERE id = $1`,
            [id])
            .then(response => {
                res.sendStatus(200);
            })
            .catch(error => {
                console.log(error);
            });
    } catch (e) {
        console.warn("Unable to insert into database");
    }
});

module.exports = router;