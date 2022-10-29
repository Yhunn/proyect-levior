const express = require('express');
const router = express();
const db = require('../../db');

router.use(express.json());
router.use(express.urlencoded({extended: false}));

const apiUsers = require('./users');
router.use('/users', apiUsers);

const apiCustomers = require('./customers');
router.use('/customers', apiCustomers);

const apiProducts = require('./products');
router.use('/products', apiProducts);

const apiProjects = require('./projects');
router.use('/projects', apiProjects);

const apiOffices = require('./offices');
router.use('/offices', apiOffices);

router.get('/*', (req,res) =>{
    res.status(400).send('Request not managed properly');
});

module.exports = router;