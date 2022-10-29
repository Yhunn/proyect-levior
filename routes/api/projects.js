const express = require('express');
const router = express.Router();
const db = require('../../db');

//GET ALL
router.get('/', (req,res) =>{
    const id = req.params.id
    db.any("SELECT * FROM projects ORDER BY id ASC")
    .then(rows => {
        res.json(rows);
    })
    .catch(error => {
        res.status(500).send(error);
    });
});

//GET FROM OFFICE
router.get('/fromOffice', (req, res) => {
    var userCity = req.user.office;
    userCity == "1"? userCity="office": null;
    db.any('SELECT * FROM projects WHERE office=$1:raw ORDER BY "id" ASC',
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
    db.any("SELECT * FROM projects WHERE id = $1", [id])
    .then(rows => {
        res.json(rows);
    })
    .catch(error => {
        res.status(500).send(error);
    });
});

//POST ONE
router.post('/', (req,res) =>{
    try {
        let { userID,userName, userOffice,utility,customer,publicCost,creationDate,endDate } = req.body;
        db.any(`INSERT INTO projects
            VALUES(DEFAULT, $1, $2, $3, $4, $5, $6, $7, 0)`,
            [utility, customer, userOffice, userID, publicCost, creationDate, endDate])
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