//JQUERY FUNCTIONS
function clearTable() {
    $("#item-list").html("");
}

var loadedPoData = [];
var productsArray = [];
var uniqueCategories = [];

$(document).ready(function () {
    const userID = $('#officeIDInput').val();
    fetch('/api/po/office/' + userID)
        .then(response => response.json())
        .then(data => {
            data.forEach(row => {
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
                    registry4: row.registry_4,
                    total: row.total_item,
                    order: row.order_balance
                });
            });
            populateRegistry();
        });
    fetch('/api/products/active')
        .then(response => response.json())
        .then(data => {
            data.forEach(row => {
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
                if (!uniqueCategories.includes(row.category)) {
                    uniqueCategories.push(row.category);
                }
            });
        });
});

function populateRegistry() {
    var checkedPO = [];
    loadedPoData.forEach(po => {
        if (!checkedPO.includes(po.registry)) {
            checkedPO.push(po.registry);
            $('#registry-select').append($('<option>', {
                value: po.registry,
                text: po.registry
            }));
        }
    });
}

function selectRegistry(selectInput) {
    clearTable();
    if (selectInput.value == "") {
        $('#po-form').trigger('reset');
    }
    loadedPoData.forEach(po => {
        if (po.registry == selectInput.value) {
            $('#customer-input').val(po.customerId);
            $('#project-input').val(po.projectId);
            $('#responsible-input').val(po.projectRes);
            $('#input-ship').val(po.shipTo);
            $('#input-req').val(po.requisitioner);
            $('#input-total-order').val(po.order);
            var poDate = new Date(po.generationDate);
            var day = poDate.getDate();
            if (day < 10) {
                day = "0" + day;
            }
            var dateString = poDate.getFullYear().toString() + "-" + (poDate.getMonth() + 1).toString() + "-" + day;
            $('#input-date').val(dateString);
            $('#input-update').val(parseInt(po.registry4));
            const productPO = productsArray.find((element) => {
                return element.id == po.productId;
            })
            var actual = $("#item-list > tr").length + 1;
            const newRow = `
                <tr>
                    <td>${actual}</td>
                    <td>
                        <select class="form-select product-category" onchange='selectCategory(this);'>
                            <option value="">Choose...</option>
                        </select>
                    </td>
                    <td>
                        <select class="form-select product-specif" form="po-form" name="products"
                        onchange='populateOffSpecification(this);' required>
                            <option selected value="">Choose...</option>
                        </select>
                    </td>
                    <td class="product-dlc">${productPO.dlc}</td>
                    <td>
                        <select class="form-select product-alt" form="po-form" name="alternative" required>
                            <option selected value="">Choose...</option>
                        </select>
                    </td>
                    <td class="product-brand">${productPO.brand}</td>
                    <td class="product-subsidiary">${productPO.subsidiary}</td>
                    <td class="product-public-cost">${productPO.publicCost}</td>
                    <td>
                        <div class="input-group">
                            <input type="number" class="form-control product-unit" value="${po.quantity}" name="quantity"
                            onchange='onQuantityChange(this);' min="0" step="1" required>
                        </div>
                    </td>
                    <td>
                        <div class="input-group">
                            <input type="number" class="form-control product-total" value="${po.total}" min="0"
                            step="1" name="totalRow" required readonly>
                        </div>
                    </td>
                </tr>
            `
            $('#item-list').append(newRow);
            updateLastAddedRow(productPO.category, productPO.id);
        }
    });
}

function updateLastAddedRow(category, id){
    updateCategories(category);
    updateSpecifications(id, category);
}

function updateCategories(category){
    var lastRow = $('#item-list > tr:last-child');
    var categoryOptions ="";
    uniqueCategories.forEach(uniqueCat =>{
        if(uniqueCat != category){
            categoryOptions = categoryOptions + "<option value=" + uniqueCat + ">"+ uniqueCat +"</option>"
        }else{
            categoryOptions = categoryOptions + "<option selected value=" + uniqueCat + ">"+ uniqueCat +"</option>"
        }
    });
    lastRow.find('.product-category').append(categoryOptions);
}

function updateSpecifications(id, category){
    var lastRow = $('#item-list > tr:last-child');
    var altSelect = lastRow.find('.product-alt');
    var prodSelect = lastRow.find('.product-specif');
    productsArray.forEach(product =>{
        if(category == product.category){
            prodSelect.append($('<option>', {
                value: id,
                text: product.specification,
                selected: product.id == id ? true : false
            }));
            if(product.id != id){
                altSelect.append($('<option>', {
                    value: id,
                    text: product.specification
                }))
            }
        }
    });
}

$('#po-form').on('reset', function (e) {
    setTimeout(function () {
        clearTable();
    });
});
