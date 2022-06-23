for (var contor = 1; contor <= 4; contor++) {
    var star = document.getElementById("star" + contor);
    document.getElementById("star" + contor).addEventListener("click", clickBookmark);
}

function clickBookmark(event) {
    var star = document.getElementById(event.srcElement.id);
    var course = star.parentElement.parentElement.parentElement.id
    if (star.src.split('/').pop() == "book0.webp") {
        //add bookmark to specified course
        updateBookmark(course, 1);
        star.src = "images/book1.webp";
    }
    else {
        //remove bookmark to specified course
        updateBookmark(course, 0);
        star.src = "images/book0.webp";
    }
}

function updateBookmark(course, action) {
    if (action == 1) console.log("Adding bookmark to course " + course);
    else console.log("Removing bookmark from course " + course);

    //event.preventDefault();
    var data = {
        user_id: null,
        course_name: course,
        bookmarked: action,
    };

    let endpoint = "courses";
    sendData(data, endpoint);

    return true;
}

function sendData(data, endpoint) {
    let url = `http://localhost:1234/${endpoint}`;
    let head = new Headers();
    head.append("Content-Type", "application/json");
    let req = new Request(url, {
        method: "POST",
        mode: "cors",
        headers: head,
        body: JSON.stringify(data),
    });
    fetch(req)
        .then((res) => res.json())
        .then((content) => {
            if ("error" in content) {
                //incerare esuata
                console.log("Eroare", content.error);
            }
            if ("data" in content) {
                console.log("Bookmark saved", data);
            }
        });
}

