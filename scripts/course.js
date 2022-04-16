// --------CODE FOR CHECKBOX---------

function enable_next_checkbox(j, checkboxElem) {
    if (document.form1.ckb[j].checked == true) {
        document.form1.ckb[j + 1].disabled = false;
    }
    else
    {
        for (i = j + 1; document.form1.ckb.length; i++) {
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

    text = "You still have some steps left";
    if (total < document.form1.ckb.length) {
        document.getElementById("message").innerHTML = text;
        return false;
    }
    else {
        document.getElementById("message").innerHTML = "";
        return true;
    }
} 


function popup() {
    window.alert("sometext");
}

// ---------CODE FOR MODAL POPUP--------

const openModalButtons = document.querySelectorAll('[data-modal-target]')
const closeModalButtons = document.querySelectorAll('[data-close-button]')
const overlay = document.getElementById('overlay')

openModalButtons.forEach(button => {
    button.addEventListener('click', () => {
        const modal = document.querySelector(button.dataset.modalTarget)
        openModal(modal)
    })
})

// overlay.addEventListener('click', () => {
//     const modals = document.querySelectorAll('.modal.active')
//     modals.forEach(modal => {
//         closeModal(modal)
//     })
// })

closeModalButtons.forEach(button => {
    button.addEventListener('click', () => {
        const modal = button.closest('.modal')
        closeModal(modal)
    })
})

function openModal(modal) {
    if (modal == null) return
    modal.classList.add('active')
    overlay.classList.add('active')
}

function closeModal(modal) {
    if (modal == null) return
    modal.classList.remove('active')
    overlay.classList.remove('active')
}