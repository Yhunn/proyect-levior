const express = require('express');
const router = express.Router();
const db = require('../../db');

//GET ALL
router.get('/', (req,res) =>{
    db.any("SELECT * FROM purchase_orders")
    .then(rows => {
        res.json(rows);
    })
    .catch(error => {
        res.status(500).send(error);
    });
});

//FROM USER OFFICE
router.get('/office/:id', (req, res) => {
    const officeId = req.params.id;
    let date_ob = new Date();
    let year = date_ob.getFullYear();
    db.any('SELECT * FROM purchase_orders WHERE office=$1:raw ORDER BY "registry_3" ASC',
    [officeId, year, year-1])
    .then(rows => {
        res.json(rows);
    })
    .catch(error => {
        res.status(500).send(error);
    });
});

//GET ONE
router.get('/:id', (req,res) =>{
    const id = req.params.id
    db.any("SELECT * FROM purchase_orders WHERE id = $1", [id])
    .then(rows => {
        res.json(rows);
    })
    .catch(error => {
        res.status(500).send(error);
    });
});

//UPDATE ONE
router.post('/:record', async (req, res) =>{
    try {
        let {
            userID, userName, userOffice, customerID, projectID, responsibleID, shipVia, fob,
            shipTerms, registryFull, inputDate, updateCount, poID, products, alternative, quantity,
            totalRow, totalOrder, requisitioner, shipTo
        } = req.body;
        var poCustomIdParts = registryFull.split('-');
        var updateChange = (parseInt(poCustomIdParts[3]) + 1).toString();
        updateChange.length == 1 ? updateChange = "0" + updateChange : null;
        var newRecordID = poCustomIdParts[0] + "-" + poCustomIdParts[1] + "-" + poCustomIdParts[2] + "-" + updateChange;
        var  updateLog = "{" + updateCount + ", " + userID + "}";
        await db.tx(t=>{
            const queries = poID.map((element, i) =>{
                return db.none(`UPDATE purchase_orders
                    SET po_responsible=$1, office=$2, customer=$3, project=$4, project_responsible=$5, 
                    po_date=$6, product=$7, quantity=$8:raw, alternative_model=$9, ship_to=$10, requisitioner=$11, 
                    ship_via=$12, fob=$13, ship_terms=$14, change_log=$15, delivered=true, registry=$16, registry_1=$17, 
                    registry_2=$18, registry_3=$19, registry_4=$20, total_item=$21:raw, order_balance=$22:raw
                    WHERE id=$23;`,
                    [userID, userOffice, customerID, projectID, responsibleID,  inputDate, products[i], parseInt(quantity[i]),
                    alternative[i], shipTo, requisitioner, shipVia, fob, shipTerms, updateLog, newRecordID,
                    poCustomIdParts[0], poCustomIdParts[1], poCustomIdParts[2], updateChange, totalRow[i], totalOrder, poID[i]]);
            });
            return t.batch(queries);
        })
        .then(data =>{
            console.log("SUCCESS");
        })
        .catch(error=>{
            console.log("ERROR HERE");
        });
        res.status(200).redirect(req.get('referer'));
    } catch (e) {
        console.warn("Post unsuccessful");
        res.status(400).send("Post unsuccessful" + e);
    }
});

//POST ONE
router.post('/', async (req, res) =>{
    try {
        let { userID, userName, userOffice, customerID, projectID, responsibleID, shipTo, 
            requisitioner, inputDate, poCustomId, products, quantity, totalRow, totalOrder } = req.body;
        for (let i = 0; i < products.length; i++) {
            var poCustomIdParts = poCustomId.split('-');
            await db.query(`INSERT INTO purchase_orders(
                id, po_responsible, office, customer, project, project_responsible, po_date, product, quantity,
                ship_to, requisitioner, change_log, delivered, registry, registry_1, registry_2, registry_3,
                registry_4, total_item, order_balance)
                VALUES (DEFAULT, $1, $2, $3, $4, $5, $6, $7, $8:raw, $9, $10, $11, false, $12, $13, $14, $15, $16, $17:raw, $18:raw);`,
                [userID, userOffice, customerID, projectID, responsibleID, inputDate, products[i], quantity[i],
                shipTo, requisitioner, "{"+userID+"}", poCustomId, poCustomIdParts[0], poCustomIdParts[1],
                poCustomIdParts[2], poCustomIdParts[3], totalRow[i], totalOrder])
            .catch(error =>{
                res.status(500).send(error);
            });
        } 
        res.status(200).redirect(req.get('referer'));
    } catch (e) {
        console.warn("Post unsuccessful");
        res.status(400).send("Post unsuccessful" + e);
    }
});


module.exports = router;