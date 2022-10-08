const express = require('express');
const router = express.Router();
const db = require('../db');
const checkPermissions = require('./check_authentication');
router.use(checkPermissions("projects"));

router.get('/', (req,res) =>{
    res.render('projects.ejs' ,{ username: req.user.name, userid: req.user.id, officeid: req.user.office });
});

router.get('/getCustomers', (req,res) =>{
    db.any('SELECT id, name FROM customers WHERE city=$1:raw ORDER BY id ASC',[req.user.office])
    .then(rows => {
        res.json(rows);
    })
    .catch(error => {
        console.log(error);
    });
});

module.exports = router;