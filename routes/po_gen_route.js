const express = require('express');
const router = express.Router();
const db = require('../db');
const checkPermissions = require('./check_authentication');
const request = require('request');

router.use(checkPermissions("po_generator"));

router.get('/', async (req, res) => {
    const idUserOffice = req.user.office;
    let date_ob = new Date();
    let date = ("0" + date_ob.getDate()).slice(-2);
    let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
    let year = date_ob.getFullYear();
    const currentDate = year + "-" + month + "-" + date;
    try {
        //LOAD CURRENT OFFICE OFF USER DATA
        const officeData = [];
        var fullUrl = req.protocol + '://' + req.get('host') + '/api/offices/' + idUserOffice;
        var fetchOffice = await getJsonFetch(fullUrl);
        officeData.push({
            id: fetchOffice[0].id,
            officeName: fetchOffice[0].office_name,
            abreviation: fetchOffice[0].abreviation
        })
        fullUrl = req.protocol + '://' + req.get('host') + '/api/po/' + idUserOffice;
        var fetchPO = await getJsonFetch(fullUrl);
        var currentPOFolio = "";
        if(fetchPO.length > 0){
            //routine to get last po noumber
        } else{
            currentPOFolio = officeData[0].abreviation + "-" + year + "-" + "0001-01"; 
        }
        res.render("po_generator.ejs", { officeData: officeData[0], userID: req.user.id, userName: req.user.name, currentDate: currentDate, poFolio: currentPOFolio });
    } catch (error) {
        console.warn("Fetch unsuccessful");
        res.status(400).send("Fetch unsuccessful\n" + e);
    }
});

router.get('/productData', (req, res) => {
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

//REQUEST FUNCTIONS
function getJsonFetch(url){
    return new Promise((resolve, reject) =>{
        request({
            url: url,
            json:true
        }, (error, response, body) => {
            if (error) reject(error);
            if (response.statusCode != 200) {
                reject('Invalid status code <' + response.statusCode + '>');
            }
            resolve(body);

        });
    });
}



module.exports = router;