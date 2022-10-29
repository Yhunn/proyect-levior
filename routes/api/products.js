const express = require('express');
const router = express.Router();
const db = require('../../db');

//GET ALL
router.get('/', (req,res) =>{
    db.any("SELECT * FROM products ORDER BY category ASC")
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
    db.any("SELECT * FROM products WHERE id = $1", [id])
    .then(rows => {
        res.json(rows);
    })
    .catch(error => {
        res.status(500).send(error);
    });
});

//POST ONE
router.post('/', (req, res) => {
    try {
        let { category, dlc, brand, specification, subsidiary, publicCost, unit } = req.body;
        db.any(`INSERT INTO products
            VALUES(DEFAULT, $1, $2, $3, $4, $5:raw, $6:raw, $7, true)`,
            [category, dlc, brand, specification, subsidiary, publicCost, unit])
            .then(response => {
                res.redirect('back');
            })
            .catch(error => {
                res.status(500).send(error);
            });
    } catch (e) {
        console.warn("Post unsuccessful");
        res.status(400).send("Post unsuccessful" + e);
    }
});

//UPDATE ONE
router.post('/:id', (req,res) => {
    try {
        const id = req.params.id;
        let { category, dlc, brand, specification, subsidiary, publicCost, unit } = req.body;
        db.any(`UPDATE products SET category=$1, dlc_or_es_model_no=$2,
        brand=$3, specification=$4, subsidiary=$5:raw, public_cost=$6:raw, measurement_unit=$7
        WHERE id = $8`,
            [category, dlc, brand, specification, subsidiary, publicCost, unit, id])
            .then(response => {
                res.redirect('back');
            })
            .catch(error => {
                res.status(500).send(error);
            });
    } catch (e) {
        console.warn("Post unsuccessful");
        res.status(400).send("Post unsuccessful" + e);
    }
});

//CHANGE STATUS
router.post('/status/:id', (req,res) =>{
    try {
        let id = req.params.id;
        let status = req.body;
        db.any(`UPDATE products SET active_product=$2 WHERE id=$1:raw`,
            [id, status.status])
            .then(response => {
                res.redirect('back');
            })
            .catch(error => {
                res.status(500).send(error);
            });
    } catch (e) {
        console.warn("Post unsuccessful");
        res.status(400).send("Post unsuccessful" + e);
    }
});

module.exports = router;