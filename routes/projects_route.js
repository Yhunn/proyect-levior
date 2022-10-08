const express = require('express');
const router = express.Router();
const db = require('../db');
const checkPermissions = require('./check_authentication');
router.use(checkPermissions("projects"));

router.get('/', (req,res) =>{
    res.render('projects.ejs' ,{ username: req.user.name, userid: req.user.id, officeid: req.user.office });
});

module.exports = router;