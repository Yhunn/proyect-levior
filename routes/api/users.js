const express = require('express');
const router = express.Router();
const db = require('../../db');

//GET ALL
router.get('/', (req,res) =>{
    db.any("SELECT * FROM users")
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
    db.any("SELECT * FROM users WHERE id = $1", [id])
    .then(rows => {
        res.json(rows);
    })
    .catch(error => {
        res.status(500).send(error);
    });
});

module.exports = router;