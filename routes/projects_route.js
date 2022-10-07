const express = require('express');
const router = express.Router();
const db = require('../db');
const checkPermissions = require('./check_authentication');
router.use(checkPermissions("projects"));

router.get('/', (req,res) =>{
    res.render('projects.ejs');
});

module.exports = router;