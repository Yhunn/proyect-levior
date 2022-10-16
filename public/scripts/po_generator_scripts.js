
var productsArray = [];
//FILLING PRODUCT DATA
$(document).ready(function(){
    setEditable();
    fetch('/PO_Generator/productData')
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
    console.log(rowCount);
}

function addRowPO(){
    $('#item-list').append(`<tr style="vertical-align: middle;">
                    <td>
                        <select class="form-select product-category" onchange='selectCategory(this);'>
                            <option selected value="0">Choose...</option>
                        </select>
                    </td>
                    <td>
                        <select class="selectpicker form-select product-specif" onfocus='this.size=5;'
                            onblur='this.size=1;' onchange='this.size=1; populateOffSpecification(this); this.blur();' disabled >
                            <option selected value="0">Choose...</option>
                        </select>
                    </td>
                    <td class="product-dlc"></td>
                    <td class="product-brand"></td>
                    <td class="product-subsidiary"></td>
                    <td class="product-public-cost"></td>
                    <td>
                        <div class="input-group">
                            <input type="number" class="form-control product-unit" value="0" disabled>
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
    if(selection.value == "0"){
        specif.prop('disabled', true);
    }else{
        productsArray.forEach(product=>{
            if(product.category == selection.value){
                specif.append($('<option>',{
                value: product.specification,
                text: product.specification
            }));
            }
        });
        specif.prop('disabled', false);
    }
}

function resetSpecificationRoutine(row, specif){
    clearRowData(row);
    specif.empty();
    specif.append('<option selected value="0">Choose...</option>');
    specif.val('0');    
}

function clearRowData(row){
    row.find('.product-dlc').text('');
    row.find('.product-brand').text('');
    row.find('.product-subsidiary').text('');
    row.find('.product-public-cost').text('');
    row.find('.product-subsidiary').attr('class', 'product-subsidiary');
    row.find('.product-public-cost').attr('class', 'product-public-cost');
    row.find('.product-unit').val('0');
    row.find('.product-unit').prop('disabled', true);
}

function populateOffSpecification(selection){
    var row = $(selection).parent().parent();
    clearRowData(row);
    if(selection.value != "0"){
        //POPULATE
        productsArray.forEach(product =>{
            if(product.specification == selection.value){
                row.find('.product-dlc').text(product.dlc);
                row.find('.product-brand').text(product.brand);
                switch (product.unit) {
                    case 'EURO':
                        row.find('.product-subsidiary').addClass('euros');
                        row.find('.product-public-cost').addClass('euros');
                        break;
                    default:
                        row.find('.product-subsidiary').addClass('dollars');
                        row.find('.product-public-cost').addClass('dollars');
                        break;
                }
                row.find('.product-subsidiary').text(product.subsidiary);
                row.find('.product-public-cost').text(product.publicCost);
                row.find('.product-unit').prop('disabled', false);
            }
        });
    }
}