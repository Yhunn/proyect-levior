const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', (req,res)=>{
    res.render("po_generator.ejs");
});

router.post('/save',(req,res)=>{
    console.log(req.body);
});

module.exports = router;