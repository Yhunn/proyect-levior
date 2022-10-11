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
    fetch('/projects/getData')
    .then(response => response.json())
    .then(data => {
        data.forEach(row =>{
            var disposeDate = new Date(row.creation_date);
            var crDate = disposeDate.getDate() + "/" +  (disposeDate.getMonth()+1) + "/" + disposeDate.getFullYear();
            disposeDate = new Date(row.dispose_date);
            var endDate = disposeDate.getDate() + "/" +  (disposeDate.getMonth()+1) + "/" + disposeDate.getFullYear();
            $('#projects-list').append(`<tr style="vertical-align: middle;">
                                <td class="id">`+row.id+`</td>
                                <td class="utility">`+row.utility+`</td>
                                <td class="customer">`+row.from_customer+`</td>
                                <td class="office">`+row.office+`</td>
                                <td class="responsible">`+row.responsible+`</td>
                                <td class="public-cost">`+row.public_cost+`</td>
                                <td class="cr-date">`+crDate+`</td>
                                <td class="end-date">`+endDate+`</td>
                                <td class="current_state">`+row.status+`</td>
                                <td class="edit text-center"><button class="btn" onclick="editRow(this)"><i class="fa fa-pencil-square-o"></i></button></td>
                            </tr>`);
        });
    });
});