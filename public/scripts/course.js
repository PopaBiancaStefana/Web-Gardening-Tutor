//---------INJECT THE CONTENT-----------

//-----FETCH LOCAL JSON FILE
async function getData(url) {
    const response = await fetch(url);

    return response.json();
}
const data = await getData("jsons/content.json");


injectContent();

function injectContent() {
    var course = sessionStorage.getItem("course");
    var diff = sessionStorage.getItem("difficulty");

    //------TITLE PART
    var title = document.getElementById("course-title");
    var h1 = document.createElement("h1");
    h1.innerHTML = course;
    title.appendChild(h1);

    var ul = document.createElement("ul");
    var li = document.createElement("li");
    li.innerHTML = diff;
    ul.appendChild(li);
    title.appendChild(ul);

    //-----TOOLS PART
    var title = document.getElementById("banner2-title");
    var h = document.createElement("h");
    h.innerHTML = "The tools you need:";
    title.appendChild(h);

    var index = 1;
    while (data[course]["tools"]["tool" + index] != undefined) {
        var li = document.getElementById("tool" + index);
        li.innerHTML = data[course]["tools"]["tool" + index];
        li.style.display = "block";
        index++;

        li.addEventListener('click', function handleClick(event) {
            change_modal(index);
        });
    }

    //------ENVIRONMENT PART
    var title = document.getElementById("banner3-title");
    var h = document.createElement("h");
    h.innerHTML = "Environment:";
    title.appendChild(h);

    var index = 1;
    while (data[course]["environment"]["env" + index] != undefined) {
        var li = document.getElementById("env" + index);
        li.innerHTML = data[course]["environment"]["env" + index];
        li.style.display = "block";
        index++;

        li.addEventListener('click', function handleClick(event) {
            change_modal();
        });
    }

    //--------TIPS PART
    var index = 1;
    const tips = document.getElementById("right");
    while (data[course]["tips"]["tip" + index] != undefined) {
        var h2 = document.createElement("h2");
        h2.innerHTML = "Tip " + index;
        tips.appendChild(h2);
        var p = document.createElement("p");
        p.innerHTML = data[course]["tips"]["tip" + index];
        tips.appendChild(p);
        index++;
    }

    //-------STEPS PART

    var index = 1;
    while (index <= 5) {
        var text = document.getElementById("text-part" + index);
        var h2 = document.createElement("h2");
        h2.innerHTML = data[course]["steps"]["step" + index + "-title"];
        text.appendChild(h2);

        var br = document.createElement("br");
        text.appendChild(br);
        var p = document.createElement("p");
        p.innerHTML = data[course]["steps"]["step" + index + "-text"];
        text.appendChild(p)

        //------IMAGES
        if (data[course]["steps"]["step" + index + "-img"] != undefined) {
            var photos = document.getElementById("photos" + index);

            var contor = 1;
            while (data[course]["steps"]["step" + index + "-img"]["img" + contor + "-src"] != undefined) {
                var gallery = document.createElement("div");
                gallery.className = "gallery";
                var image = document.createElement("img");
                image.src = data[course]["steps"]["step" + index + "-img"]["img" + contor + "-src"];
                image.alt = data[course]["steps"]["step" + index + "-img"]["img" + contor + "-src"];
                gallery.appendChild(image);
                var description = document.createElement("div");
                description.className = "desc";
                description.innerText = data[course]["steps"]["step" + index + "-img"]["img" + contor + "-desc"];
                gallery.appendChild(description);
                photos.appendChild(gallery);

                contor++;
            }
        }
        index++;
    }
}

function change_modal() {

    window.onclick = e => {
        var course = sessionStorage.getItem("course");
        var modal = document.getElementById("modal-text");
        modal.innerHTML = data[course]["tools"][e.target.id + "-modal"];
    }
}



// --------CODE FOR CHECKBOX---------

//const checkbox1 = document.getElementById('test1');
// checkbox1.addEventListener('click', enable_next_checkbox(1));

function enable_next_checkbox(j) {
    if (document.form1.ckb[j].checked == true) {
        document.form1.ckb[j + 1].disabled = false;
    }
    else {
        for (var i = j + 1; document.form1.ckb.length; i++) {
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
        return true;
    }
}
//GLOBAL -not recomended
window.return_val = return_val;
window.enable_next_checkbox = enable_next_checkbox;


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
