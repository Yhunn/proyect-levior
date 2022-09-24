//TO BE RE-WRITTEN INTO JQUERY
function setEditable() {
    var tbody = document.getElementsByClassName('editable-body');

    for (var i = 0; i < tbody.length; i++) {
        var tds = tbody[i].getElementsByTagName("td");
        for (var n = 0; n < tds.length; n++) {
            tds[n].setAttribute('contenteditable', 'true');
        }
    }
}

//OBSOLETE TO BE RE-WRITTEN WITH JQUERY INTO PO_SUPPLY SCRIPTS
function selectPO() {
    var select = document.getElementById('inputGroupSelect01');
    var value = select.options[select.selectedIndex].value;
    if (value != 0) {
        clearAll();
        fetch('/PO_Supply/populate', {
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify({
                dataSearch: value
            })
        })
        .then(response => response.json())
        .then(data => {
            data.forEach(row => {
                document.getElementById("input-name").value = row.projectName;
                document.getElementById("input-ship").value = row.shipTo;
                document.getElementById("input-req").value = row.requisitioner;

                var itemList = document.getElementById("body-to-populate");
                var newRow = document.createElement("tr");

                var modelCell = document.createElement("td");
                modelCell.classList.add("model");
                modelCell.innerHTML = row.model;

                var altCell = document.createElement("td");
                altCell.classList.add("alt");

                var descCell = document.createElement("td");
                descCell.classList.add("desc");
                descCell.innerHTML = row.description;

                var qntyCell = document.createElement("td");
                qntyCell.classList.add("qnty");
                qntyCell.innerHTML = row.quantity;

                newRow.appendChild(modelCell);
                newRow.appendChild(altCell);
                newRow.appendChild(descCell);
                newRow.appendChild(qntyCell);

                itemList.appendChild(newRow);
            });
            setEditable();
        });
    }
}

