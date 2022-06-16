function enable_next_checkbox(j) {
    if (document.form1.ckb[j].checked == true && j < (document.form1.ckb.length-1)) {
        document.form1.ckb[j + 1].disabled = false;
    }
    else {
        for (var i = j + 1; i < document.form1.ckb.length; i++) {
            document.form1.ckb[i].checked = false;
            document.form1.ckb[i].disabled = true;
        }
       
    }
}

function return_val() {
    var total = 0;
    for (var i = 0; i < document.form1.ckb.length; i++) {
        if (document.form1.ckb[i].checked) {
            total = total + 1;
        }
    }

    var text = "You still have some steps left";
    if (total < document.form1.ckb.length) {
        document.getElementById("message").innerHTML = text;
        return false;
    }
    else {
        document.getElementById("message").innerHTML = "";
        console.log("done");
        return true;
    }
}