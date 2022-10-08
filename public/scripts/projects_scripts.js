$(document).ready(function(){
    fetch('/projects/getCustomers')
    .then(response => response.json())
    .then(data => {
        var options = ``;
        data.forEach(row =>{
            options += "<option value="+row.id+">"+row.name+"</option>";
        });
        $('#customer-input').append(options);
    });
});