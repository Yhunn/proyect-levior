var productsArray = [];
$(document).ready(function(){
    fetch('/api/products')
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

$("#change-form").on("submit", function(){
    const id = $('#id-input-modal').val();
    const newAction = "/api/products/" + id;
    console.log(id);
    $("#change-form").attr('action', newAction);
    return true;
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

function checkActivation(){
    var id = $('#id-input-modal').val();
    var ischecked= $("#activeSwitch").is(':checked');
    console.log(id);
    $.post("api/products/status/"+id, {
        status: ischecked
    },
    function (data, status) {
        location.reload();
    });
}