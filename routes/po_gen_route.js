const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', checkPermissionsForPOGenerator, (req, res) => {
    const idUserOffice = req.user.office;
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
            res.render("po_generator.ejs",{ officeData: officeData[0] });
        });
    } catch (error) {
        console.warn('Failed to load from database');
    }
});

router.get('/productData', checkPermissionsForPOGenerator, (req,res)=>{
    db.any("SELECT * FROM products")
    .then(rows => {
        res.json(rows);
    })
    .catch(error => {
        console.log(error);
    });
});

router.post('/save', checkPermissionsForPOGenerator, (req, res) => {
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

//MIDDLEWARE FUNCTIONS
function checkPermissionsForPOGenerator(req, res, next) {
    if(req.isAuthenticated()){
        const allowedPermisionsForPOGenerator = ['*','1'];
        var userPermissions = String(req.user.role).split(',');

        if(allowedPermisionsForPOGenerator.some(permision=> userPermissions.includes(permision))){
            return next();
        }
    }
    res.redirect('/');
}

module.exports = router;