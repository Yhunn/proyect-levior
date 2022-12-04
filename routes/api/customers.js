const express = require('express');
const router = express.Router();
const db = require('../../db');

//GET ALL
router.get('/', (req,res) =>{
    db.any("SELECT * FROM customers")
    .then(rows => {
        res.json(rows);
    })
    .catch(error => {
        res.status(500).send(error);
    });
});

//FROM USER OFFICE
router.get('/fromOffice', (req, res) => {
    var userCity = req.user.office;
    userCity == "1"? userCity="city": null;
    db.any('SELECT * FROM customers WHERE city=$1:raw ORDER BY "id" ASC',
    [userCity])
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
    db.any("SELECT * FROM customers WHERE id = $1", [id])
    .then(rows => {
        res.json(rows);
    })
    .catch(error => {
        res.status(500).send(error);
    });
});

//UPDATE ONE
router.post('/:id', (req, res) =>{
    try {
        const id = req.params.id;
        let { name, address, account, currency, email, phone, city } = req.body;
        db.any(`UPDATE customers
            SET name=$1, address=$2, account=$3, currency=$4, e_mail=$5, phone=$6, city=$7:raw
            WHERE id=$8;`,
            [name, address, account, currency, email, phone, city, id])
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

//POST ONE
router.post('/', (req, res) =>{
    try {
        let { name, address, account, currency, email, phone, city } = req.body;
        db.any(`INSERT INTO customers
            VALUES(DEFAULT, $1, $2, $3, $4, $5, $6, $7:raw, true)`,
            [name, address, account, currency, email, phone, city])
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

//SWITCH STATUS
router.post('/status/:id', (req,res) =>{
    const id = req.params.id;
    let status = req.body;
    try {
        db.any(`UPDATE customers SET status=$2 WHERE id=$1 `,
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