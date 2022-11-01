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
        const fetchOffice = await getJsonFetch(fullUrl);
        officeData.push({
            id: fetchOffice[0].id,
            officeName: fetchOffice[0].office_name,
            abreviation: fetchOffice[0].abreviation
        })
        fullUrl = req.protocol + '://' + req.get('host') + '/api/po/office/' + idUserOffice;
        const fetchPO = await getJsonFetch(fullUrl);
        var currentPOFolio = "";
        if(fetchPO.length > 0){
            var lastPO = 0;
            fetchPO.forEach(po => {
                const lastRegistered = parseInt(po.registry_3);
                lastRegistered > lastPO ? lastPO = lastRegistered : null;
            });
            lastPO++;
            const numberLength = lastPO.toString().length;
            const zeroLength = 4-numberLength;
            var nextPO = "";
            for (let i = 0; i < zeroLength; i++) {
                nextPO = nextPO + "0";
            }
            nextPO = nextPO + lastPO.toString();
            currentPOFolio = officeData[0].abreviation + "-" + year + "-" + nextPO + "-01"; 
        } else{
            currentPOFolio = officeData[0].abreviation + "-" + year + "-" + "0001-01"; 
        }
        res.render("po_generator.ejs", { officeData: officeData[0], userID: req.user.id, userName: req.user.name, currentDate: currentDate, poFolio: currentPOFolio });
    } catch (error) {
        console.warn("Fetch unsuccessful");
        res.status(400).send("Fetch unsuccessful\n" + e);
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