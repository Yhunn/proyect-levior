const express = require('express');
const router = express.Router();
const db = require('../db');
const checkPermissions = require('./check_authentication');
router.use(checkPermissions("customers"));

router.get('/', (req, res) => {
    res.render('customers.ejs');
});

module.exports = router;