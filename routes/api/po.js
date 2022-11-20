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
router.post('/:id', (req, res) =>{
    
});

//POST ONE
router.post('/', async (req, res) =>{
    try {
        let { userID, userName, userOffice, customerID, projectID, responsibleID, shipTo, 
            requisitioner, inputDate, poCustomId, products, quantity, totalRow, totalOrder } = req.body;
        for (let i = 0; i < products.length; i++) {
            poCustomIdParts = poCustomId.split('-');
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
    } catch (error) {
        console.warn("Post unsuccessful");
        res.status(400).send("Post unsuccessful" + e);
    }
});


module.exports = router;