//JQUERY FUNCTIONS
function clearTable() {
    $("#body-to-populate").html("");
}

var loadedPoData = [];

$(document).ready(function(){
    const userID = $('#officeIDInput').val();
    fetch('/api/po/office/'+ userID)
    .then(response => response.json())
    .then(data => {
        data.forEach(row =>{
            loadedPoData.push({
                id: row.id,
                po_responsible: row.po_responsible,
                officeId: row.office,
                customerId: row.customer,
                projectId: row.project,
                projectRes: row.project_responsible,
                generationDate: row.po_date,
                productId: row.product,
                quantiy: row.quantiy,
                shipTo: row.ship_to,
                requisitioner: row.requisitioner,
                changelog: row.change_log,
                delivered: row.delivered,
                registry: row.registry,
                registry1: row.registry_1,
                registry2: row.registry_2,
                registry3: row.registry_3,
                registry4: row.registry_4
            });
        });
        populateRegistry();
    });
});

function populateRegistry(){
    var checkedPO = [];
    loadedPoData.forEach(po =>{
        if(!checkedPO.includes(po.registry)){
            checkedPO.push(po.registry);
            $('#registry-select').append($('<option>',{
                value: po.registry,
                text: po.registry
            }));
        }
    });
}