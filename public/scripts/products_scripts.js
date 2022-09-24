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