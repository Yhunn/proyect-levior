function push_Product(){
    var category = $('#category-input').val();
    var dlc = $('#dlc-input').val();
    var brand = $('#brand-input').val();
    var specification = $('#specification-input').val();
    var subsidiary = $('#subsidiary-input').val();
    var publicCost = $('#public-cost-input').val();
    var unit = $( "#unit-input option:selected" ).text();
    
    $.post("products/save", {
        category: category,
        dlc: dlc,
        brand: brand,
        specification: specification,
        subsidiary: subsidiary,
        publicCost: publicCost,
        unit: unit
    },
    function (data, status) {
        location.reload();
    });
}

var productsArray = [];
$(document).ready(function(){
    fetch('/products/getData')
    .then(response => response.json())
    .then(data => {
        data.forEach(row =>{
            var status = row.active_product == true ? "Active" : "Inactive";
            $('#product-list').append(`<tr style="vertical-align: middle;">
                                <td class="id">`+row.id+`</td>
                                <td class="category">`+row.category+`</td>
                                <td class="specification">`+row.specification+`</td>
                                <td class="dlc">`+row.dlc_or_es_model_no+`</td>
                                <td class="brand">`+row.brand+`</td>
                                <td class="subsidiary">`+row.subsidiary+`</td>
                                <td class="public-cost">`+row.public_cost+`</td>
                                <td class="unit">`+row.measurement_unit+`</td>
                                <td class="status">`+status+`</td>
                                <td class="edit text-center"><button class="btn" onclick="editRow(this)"><i class="fa fa-pencil-square-o"></i></button></td>
                            </tr>`);
        });
    });
});

function editRow(button){
    var row = $(button).parent().parent();
    var id = row.find('.id').text();
    var category = row.find('.category').text();
    var specification = row.find('.specification').text();
    var dlc = row.find('.dlc').text();
    var brand = row.find('.brand').text();
    var subsidiary = row.find('.subsidiary').text();
    var publicCost = row.find('.public-cost').text();
    var unit = row.find('.unit').text();
    var status = row.find('.status').text();
    $('#id-input-modal').val(id);
    $('#category-input-modal').val(category);
    $('#dlc-input-modal').val(dlc);
    $('#brand-input-modal').val(brand);
    $('#specification-input-modal').val(specification);
    $('#subsidiary-input-modal').val(subsidiary);
    $('#public-cost-input-modal').val(publicCost);
    $( "#unit-input-modal").val(unit);
    $('#pop-up-content').modal('toggle');
    if(status == "Inactive"){
        $("#activeSwitch").prop('checked', false);
    }
}

function pushChanges(){
    var id = $('#id-input-modal').val();
    var category = $('#category-input-modal').val();
    var dlc = $('#dlc-input-modal').val();
    var brand = $('#brand-input-modal').val();
    var specification = $('#specification-input-modal').val();
    var subsidiary = $('#subsidiary-input-modal').val();
    var publicCost = $('#public-cost-input-modal').val();
    var unit = $( "#unit-input-modal option:selected" ).text();
    
    $.post("products/change", {
        id: id,
        category: category,
        dlc: dlc,
        brand: brand,
        specification: specification,
        subsidiary: subsidiary,
        publicCost: publicCost,
        unit: unit
    },
    function (data, status) {
        location.reload();
    });
}

function checkActivation(){
    var id = $('#id-input-modal').val();
    var ischecked= $("#activeSwitch").is(':checked');
    $.post("products/changeStatus", {
        id: id,
        status: ischecked
    },
    function (data, status) {
        location.reload();
    });
    
}