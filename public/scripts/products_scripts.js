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
            $('#product-list').append(`<tr style="vertical-align: middle;">
                                <td class="id">`+row.id+`</td>
                                <td class="category">`+row.category+`</td>
                                <td class="specification">`+row.specification+`</td>
                                <td class="dlc">`+row.dlc_or_es_model_no+`</td>
                                <td class="brand">`+row.brand+`</td>
                                <td class="subsidiary">`+row.subsidiary+`</td>
                                <td class="public-cost">`+row.public_cost+`</td>
                                <td class="unit">`+row.measurement_unit+`</td>
                                <td class="edit text-center"><button class="btn" onclick="editRow(this)"><i class="fa fa-pencil-square-o"></i></button></td>
                            </tr>`);
        });
    });
});

function editRow(button){
    
    $('#pop-up-content').modal('toggle');
}