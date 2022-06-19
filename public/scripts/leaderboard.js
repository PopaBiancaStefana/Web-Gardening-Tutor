makeTable();

function makeTable(event) {
    console.log("Getting the table");

    let endpoint = "topUsers";
    getData(endpoint, processData);
}
function getData(endpoint, callback) {
    let url = `http://localhost:1234/${endpoint}`;
    let head = new Headers();
    head.append("Content-Type", "application/json");
    let req = new Request(url, {
        method: "GET",
        mode: "cors",
        headers: head,
    });
    fetch(req)
        .then((res) => res.json())
        .then((content) => {
            if ("error" in content) {
                //incercare esuata
                console.log(content.error);
            }
            if ("data" in content) {
                callback(content.data);
            }
        });
}

function processData(data) {
    console.log("Leaderboard data:", data);

    data.forEach(function (line) {
        let row = document.createElement("div");
        row.className = "divTableRow";

        let cell1 = document.createElement("div");
        cell1.className = "divTableCell";
        cell1.id = "rank";
        cell1.innerText = line.rownum;
        row.appendChild(cell1);

        let cell2 = document.createElement("div");
        cell2.className = "divTableCell";
        img = document.createElement("img");
        if (line.photo_path != null) {
            img.src = line.photo_path;
        }
        img.alt = "Someone happy to be in top 10";
        cell2.appendChild(img);
        row.appendChild(cell2);

        let cell3 = document.createElement("div");
        cell3.className = "divTableCell";
        cell3.id = "name";
        cell3.innerText = line.name;
        row.appendChild(cell3);

        let cell4 = document.createElement("div");
        cell4.className = "divTableCell";
        cell4.id = "finished_courses";
        cell4.innerText = line.finished_courses;
        row.appendChild(cell4);

        let table = document.getElementById("leaderboard");
        table.appendChild(row);
    });
}