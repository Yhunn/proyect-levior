const express = require('express');
const router = express.Router();
const db = require('../db');
const checkPermissions = require('./check_authentication');
router.use(checkPermissions("projects"));

router.get('/', (req, res) => {
    let date_ob = new Date();
    let date = ("0" + date_ob.getDate()).slice(-2);
    let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
    let year = date_ob.getFullYear();
    const currentDate= year + "-" + month + "-" + date;

    res.render('projects.ejs', { username: req.user.name, userid: req.user.id, officeid: req.user.office, date: currentDate });
});

router.get('/getCustomers', (req, res) => {
    var userCity = req.user.office;
    userCity == "1"? userCity="city": null;
    db.any('SELECT id, name FROM customers WHERE city=$1:raw ORDER BY id ASC', [userCity])
        .then(rows => {
            res.json(rows);
        })
        .catch(error => {
            console.log(error);
        });
});

module.exports = router;