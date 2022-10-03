var productsArray = [];
$(document).ready(function(){
    fetch('/customers/getCities')
    .then(response => response.json())
    .then(data => {
        var options = ``;
        data.forEach(row =>{
            options += "<option value="+row.id+">"+row.office_name+"</option>";
        });
        $('#city-id-input').append(options);
    });
});