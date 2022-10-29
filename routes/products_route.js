const express = require('express');
const router = express.Router();
const db = require('../db');
const checkPermissions = require('./check_authentication');
router.use(checkPermissions("products"));

router.get('/', (req, res) => {
    res.render('products.ejs');
});

module.exports = router;