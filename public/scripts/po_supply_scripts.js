//JQUERY FUNCTIONS
function clearTable() {
    $("#body-to-populate").html("");
}

function clearAll() {
    $("#input-name").val("");
    $("#input-ship").val("");
    $("#input-req").val("");
    $("#input-via").val("");
    $("#input-fob").val("");
    $("#input-terms").val("");
    clearTable();
}

function pushSupply() {
    $('#tablePO > tbody > tr').each(function () {
        var pName = $("#input-name").val();
        var shipTo = $("#input-ship").val();
        var requis = $("#input-req").val();
        var via = $("#input-via").val();
        var fob = $("#input-fob").val();
        var terms = $("#input-terms").val();

        var model = $(this).find(".model").text();
        var alt = $(this).find(".alt").text();
        var desc = $(this).find(".desc").text();
        var qnty = $(this).find(".qnty").text();

        var poID = $("#inputGroupSelect01 option:selected").val();

        $.post("PO_Query/save", {
            pName: pName,
            shipTo: shipTo,
            requis: requis,
            via: via,
            fob: fob,
            terms: terms,
            model: model,
            alt: alt,
            desc: desc,
            qnty: qnty,
            poID: poID
        },
            function (data, status) { });
        $(this).remove();
    });
    clearAll();
}