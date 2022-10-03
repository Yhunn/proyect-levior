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
    fetch('/customers/getData')
    .then(response => response.json())
    .then(data =>{
        data.forEach(row=>{
            console.log(row.e_mail);
            var status = row.status == true ? "Active" : "Inactive";
            $('#customer-list').append(`<tr style="vertical-align: middle;">
                                <td class="id">`+row.id+`</td>
                                <td class="name">`+row.name+`</td>
                                <td class="address">`+row.address+`</td>
                                <td class="account">`+row.account+`</td>
                                <td class="currency">`+row.currency+`</td>
                                <td class="e-mail">`+row.e_mail+`</td>
                                <td class="phone">`+row.phone+`</td>
                                <td class="city">`+row.city+`</td>
                                <td class="status">`+status+`</td>
                                <td class="edit text-center"><button class="btn" onclick="editRow(this)"><i class="fa fa-pencil-square-o"></i></button></td>
                            </tr>`);
        });
    });
});

/*

*/