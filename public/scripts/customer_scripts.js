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
        $('#city-id-modal').append(options);
    });
    fetch('/customers/getData')
    .then(response => response.json())
    .then(data =>{
        data.forEach(row=>{
            var status = row.status == true ? "Active" : "Inactive";
            $('#customer-list').append(`<tr style="vertical-align: middle;">
                                <td class="id">`+row.id+`</td>
                                <td class="name">`+row.name+`</td>
                                <td class="address">`+row.address+`</td>
                                <td class="account">`+row.account+`</td>
                                <td class="currency">`+row.currency+`</td>
                                <td class="e_mail">`+row.e_mail+`</td>
                                <td class="phone">`+row.phone+`</td>
                                <td class="city">`+row.city+`</td>
                                <td class="status">`+status+`</td>
                                <td class="edit text-center"><button class="btn" onclick="editRow(this)"><i class="fa fa-pencil-square-o"></i></button></td>
                            </tr>`);
        });
    });
});

function editRow(button){
    var row = $(button).parent().parent();
    var id = row.find('.id').text();
    var name = row.find('.name').text();
    var address = row.find('.address').text();
    var account = row.find('.account').text();
    var currency = row.find('.currency').text();
    var e_mail = row.find('.e_mail').text();
    var phone = row.find('.phone').text();
    var city = row.find('.city').text();
    var status = row.find('.status').text();
    $('#id-modal').val(id);
    $('#name-modal').val(name);
    $('#address-modal').val(address);
    $('#account-modal').val(account);
    $('#currency-modal').val(currency);
    $('#email-modal').val(e_mail);
    $('#phone-modal').val(phone);
    $( "#city-id-modal").val(city);
    $('#pop-up-content').modal('toggle');
    if(status == "Inactive"){
        $("#activeSwitch").prop('checked', false);
    }
}

function checkActivation(){
    var id = $('#id-modal').val();
    var ischecked= $("#activeSwitch").is(':checked');
    $.post("customers/changeStatus", {
        id: id,
        status: ischecked
    },
    function (data, status) {
        location.reload();
    });
    
}