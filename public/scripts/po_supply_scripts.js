//JQUERY FUNCTIONS
function clearTable() {
    $("#item-list").html("");
}

var loadedPoData = [];
var productsArray = [];

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
                quantity: row.quantity,
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
    fetch('/api/products/active')
    .then(response => response.json())
    .then(data => {
        data.forEach(row =>{
            productsArray.push({
                id: row.id,
                category: row.category,
                dlc: row.dlc_or_es_model_no,
                brand: row.brand,
                specification: row.specification,
                subsidiary: row.subsidiary,
                publicCost: row.public_cost,
                unit: row.measurement_unit
            });
        });
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

function selectRegistry(selectInput){
    clearTable();
    if(selectInput.value == ""){
        $('#po-form').trigger('reset');
    }
    loadedPoData.forEach(po =>{
        if(po.registry == selectInput.value){
            $('#customer-input').val(po.customerId);
            $('#project-input').val(po.projectId);
            $('#responsible-input').val(po.projectRes);
            $('#input-ship').val(po.shipTo);
            $('#input-req').val(po.requisitioner);
            var poDate = new Date(po.generationDate);
            var day = poDate.getDate();
            if (day < 10) {
                day = "0" + day;
            }
            var dateString = poDate.getFullYear().toString() + "-" + (poDate.getMonth()+1).toString() + "-" + day;
            $('#input-date').val(dateString);
            $('#input-update').val(parseInt( po.registry4 ));
            const productPO = productsArray.find((element)=>{
                return element.id == po.productId;
            })
            var actual = $("#item-list > tr").length + 1;
            const newRow = `
                <tr>
                    <td>${actual}</td>
                    <td>${productPO.category}</td>
                    <td>${productPO.specification}</td>
                    <td>${productPO.dlc}</td>
                    <td></td>
                    <td>${productPO.brand}</td>
                    <td>${productPO.subsidiary}</td>
                    <td>${productPO.publicCost}</td>
                    <td>${po.quantity}</td>
                </tr>
            `
            $('#item-list').append(newRow);
        }
    });
}

$('#po-form').on('reset', function(e){
    setTimeout(function() {
        clearTable();
    });
});
