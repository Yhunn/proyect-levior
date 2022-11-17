
var productsArray = [];
var projectsArray = [];
//FILLING PRODUCT DATA
$(document).ready(function(){
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
    fetch('/api/customers')
    .then(response => response.json())
    .then(data => {
        data.forEach(row => {
            if(row.city == +$('#officeIDInput').val() || $('#officeIDInput').val() == 1){
                $('#customer-input').append($('<option>',{
                    value: row.id,
                    text: row.name
                }));
            }
        });
    });
    fetch('/api/projects')
    .then(response => response.json())
    .then(data => {
        data.forEach(row => {
            projectsArray.push({
                id: row.id,
                utility: row.utility,
                customer: row.from_customer,
                responsible: row.responsible
            });
        });
    });
});

var rowCount = 0;

function onRowChange(inputRow){
    var changeValue= $(inputRow).val()
    if(changeValue > rowCount){
        for (rowCount; rowCount < changeValue; rowCount++) {
            addRowPO();            
        }
    }
    if(changeValue < rowCount){
        for (rowCount; rowCount > changeValue; rowCount--) {
            removeRowPO();            
        }
    }
}

function addRowPO(){
    var actual = $("#item-list > tr").length + 1;
    $('#item-list').append(`<tr style="vertical-align: middle;">
                    <td>${actual}</td>
                    <td>
                        <select class="form-select product-category" onchange='selectCategory(this);'>
                            <option selected value="">Choose...</option>
                        </select>
                    </td>
                    <td>
                        <select class="selectpicker form-select product-specif" form="po-form" name="products"
                        onchange='populateOffSpecification(this);' required>
                            <option selected value="">Choose...</option>
                        </select>
                    </td>
                    <td class="product-dlc"></td>
                    <td class="product-brand"></td>
                    <td class="product-subsidiary"></td>
                    <td class="product-public-cost"></td>
                    <td>
                        <div class="input-group">
                            <input type="number" class="form-control product-unit" value="" name="quantity"
                            onchange='onQuantityChange(this);' min="0" step="1" required>
                          </div>
                    </td>
                    <td>
                        <div class="input-group">
                            <input type="number" class="form-control total-price" value="" min="0"
                            step="1" name="totalRow" required readonly>
                          </div>
                    </td>
                </tr>`);
    var uniqueCategories = [];
    productsArray.forEach(product =>{
        if(!uniqueCategories.includes(product.category)){
            uniqueCategories.push(product.category);
            $('#item-list tr:last-child').find('.product-category').append($('<option>',{
                value: product.category,
                text: product.category
            }));
        }
    });
}

function removeRowPO(){
    $('#item-list tr:last-child').remove();
}

function btnPressedRemove(){
    const rowInput = +$("#input-row-count").val();
    if (rowInput > 0) {
        $("#input-row-count").val(rowInput-1);
    }
    $("#input-row-count").change();
}

function btnPressedAdd(){
    const rowInput = +$("#input-row-count").val();
    $("#input-row-count").val(rowInput+1);
    $("#input-row-count").change();
}

function selectCategory(selection){
    var row = $(selection).parent().parent();
    var specif = row.find('.product-specif');
    resetSpecificationRoutine(row, specif);
    if(selection.value == ""){
        //specif.prop('disabled', true);
    }else{
        productsArray.forEach(product=>{
            if(product.category == selection.value){
                specif.append($('<option>',{
                value: product.id,
                text: product.specification
            }));
            }
        });
        //specif.prop('disabled', false);
    }
}

function selectCustomer(selection){
    var projectInput= $('#project-input');
    if(selection.value == ""){
        $(projectInput).empty();
        $(projectInput).append('<option selected value="">Choose...</option>');
        $(projectInput).val('');
        $(projectInput).attr('disabled', true);
        $(projectInput).change();
    } else{
        projectsArray.forEach(project =>{
            if (project.customer == selection.value) {
                $(projectInput).append($('<option>',{
                    value: project.id,
                    text: project.utility
                }));
            }
        });
        $(projectInput).removeAttr('disabled');
    }
}

function selectProject(selection){
    var projectInput= $('#responsible-input');
    if(selection.value == ""){
        $(projectInput).removeAttr('readonly');
        $(projectInput).attr('value','');
        $(projectInput).attr('readonly', true);
    }else{
        projectsArray.forEach(project =>{
            if(project.id == selection.value){
                $(projectInput).removeAttr('readonly');
                $(projectInput).attr('value', project.responsible);
                $(projectInput).attr('readonly', true);
            }
        });
    }
}

function resetSpecificationRoutine(row, specif){
    clearRowData(row);
    specif.empty();
    specif.append('<option selected value="">Choose...</option>');
    specif.val('');    
}

function clearRowData(row){
    row.find('.product-dlc').text('');
    row.find('.product-brand').text('');
    row.find('.product-subsidiary').text('');
    row.find('.product-public-cost').text('');
    row.find('.product-subsidiary').attr('class', 'product-subsidiary');
    row.find('.product-public-cost').attr('class', 'product-public-cost');
    row.find('.total-price').attr('class', 'form-control total-price');
    row.find('.product-unit').val('');
    row.find('.total-price').val('');
    //row.find('.product-unit').val('0');
    //row.find('.product-unit').prop('disabled', true);
}

function populateOffSpecification(selection){
    var row = $(selection).parent().parent();
    clearRowData(row);
    if(selection.value != ""){
        //POPULATE
        productsArray.forEach(product =>{
            if(product.id == selection.value){
                row.find('.product-dlc').text(product.dlc);
                row.find('.product-brand').text(product.brand);
                switch (product.unit) {
                    case 'EURO':
                        row.find('.product-subsidiary').addClass('euros');
                        row.find('.product-public-cost').addClass('euros');
                        row.find('.total-price').addClass('euros');
                        break;
                    default:
                        row.find('.product-subsidiary').addClass('dollars');
                        row.find('.product-public-cost').addClass('dollars');
                        row.find('.total-price').addClass('dollars');
                        break;
                }
                row.find('.product-subsidiary').text(product.subsidiary);
                row.find('.product-public-cost').text(product.publicCost);
                //row.find('.product-unit').prop('disabled', false);
            }
        });
    }
}

$('#po-form').on('reset', function(e){
    setTimeout(function() {
        onRowChange($('#input-row-count'));
    });
    alert("Form cleared");
});

$('#po-form').on('submit', function(e){
    alert("Data successfully submitted");
});

function onQuantityChange(input){
    var row = $(input).closest("tr");
    var cost = row.find('.product-public-cost').text();
    var quantity = input.value;
    row.find('.total-price').val((quantity*cost));

    setBalance();
}

function setBalance(){
    var balance = 0;
    $("#item-list > tr").each(function() {
        var priceRow = $(this).find(".total-price").val();
        console.log(priceRow);
        priceRow == "" ? null: balance = balance + parseFloat(priceRow);
        console.log(balance);
    });
    $("#input-total-order").val(balance);
}