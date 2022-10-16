const express = require('express');
const router = express.Router();
const db = require('../db');
const checkPermissions = require('./check_authentication');
router.use(checkPermissions("po_generator"));

router.get('/', (req, res) => {
    const idUserOffice = req.user.office;
    let date_ob = new Date();
    let date = ("0" + date_ob.getDate()).slice(-2);
    let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
    let year = date_ob.getFullYear();
    const currentDate= year + "-" + month + "-" + date;
    try {
        //LOAD CURRENT OFFICE OFF USER DATA
        db.any(`SELECT * FROM "office_locations" WHERE "id" = $1`,[idUserOffice])
        .then(rows =>{
            const officeData = []
            rows.forEach(row =>{
                officeData.push({
                    id: row.id,
                    officeName: row.office_name,
                    abreviation: row.abreviation
                });
            });
            //SEARCH FOR LAST PO GENERATED FROM LOCATION
            /*  --
                const poDate = new Date();
                const poMonth = poDate.getMonth() +1;
                const poYear = poDate.getFullYear();
                const poIdDate = String(poYear).concat("-",poMonth);

                DB QUERY SELECT MAX("monthlyNumeration") FROM "purchase_order" WHERE (OFFICE = idUserOffice.id
                && PO_Period = poIdDate)
                then(rows =>{
                    const nextPO = Integer(rows[0].monthlyNumeration) + 1;
                    render('pogenerator.ejs', {officeData, netPO})
                });

            */
            res.render("po_generator.ejs",{ officeData: officeData[0], userID: req.user.id, userName: req.user.name, currentDate: currentDate });
        });
    } catch (error) {
        console.warn('Failed to load from database');
    }
});

router.get('/productData', (req,res)=>{
    db.any("SELECT * FROM products WHERE active_product=true ORDER BY id ASC")
    .then(rows => {
        res.json(rows);
    })
    .catch(error => {
        console.log(error);
    });
});

router.post('/save', (req, res) => {
    let { pName,
        shipTo,
        requis,
        model,
        desc,
        qnty,
        poID } = req.body;

    //DATABASE INSERT QUERY - FOR CATEGORY
    try {
        db.query(`INSERT INTO $1:name VALUES(default, $2, $3, $4, $5, $6, $7, $8, $9)`, ['po_toDeliver_provisional'
        , poID, pName, shipTo, requis, model, desc, qnty, false])
            .then(response => {
                console.log("query successful, data added to database");
            });
    } catch (err) {
        console.warn("Unable to insert into database");
    }
});

module.exports = router;