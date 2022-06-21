//autochecking the form according to the progress of the course
loadCheckpoints();


function loadCheckpoints(event) {
  // event.preventDefault();

  console.log("Loading checkpoints");

  var course = sessionStorage.getItem("course");
  if (course == undefined) {
    console.log("The course doesn't exist.");
  }

  let endpoint = "course_template";
  progress = getData(course, endpoint);
}

function getData(course, endpoint) {
  let url = `http://localhost:1234/${endpoint}`;
  let head = new Headers();

  head.append("course", course);
  let req = new Request(url, {
    method: "GET",
    headers: head,
  });
  fetch(req)
    .then((res) => res.json())
    .then((content) => {
      if ("error" in content) {
        //incerare esuata
        console.log(content.error);
      }
      if ("progress" in content) {
        console.log("Got checkpoints: ", content.progress);
        putProgress(content.progress);
      }
    });
}

function putProgress(progress) {
  console.log("se ajunge in fuctia de aci" + progress);
  //make the checkboxes definitively checked
  for (var i = 0; i < progress; i++) {
    document.form1.ckb[i].checked = true;
    document.form1.ckb[i].disabled = true;
  }
  if (i < 5) {
    document.form1.ckb[i].disabled = false;
  }
}

function saveForm(event) {
  //event.preventDefault();
  console.log("saving the form");

  var course = sessionStorage.getItem("course");
  if (course == undefined) {
    console.log("The course doesn't exist.");
  }

  var total = 0;
  for (var i = 0; i < document.form1.ckb.length; i++) {
    if (document.form1.ckb[i].checked) {
      total = total + 1;
    }
  }
  putProgress(total);

  var data = {
    user_id: null,
    course_name: course,
    progress: total,
  };

  let endpoint = "course_template";
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
        console.log("Form saved", data);
      }
    });
}

function enable_next_checkbox(j) {
  if (
    document.form1.ckb[j].checked == true &&
    j < document.form1.ckb.length - 1
  ) {
    document.form1.ckb[j + 1].disabled = false;
  } else {
    for (var i = j + 1; i < document.form1.ckb.length; i++) {
      document.form1.ckb[i].checked = false;
      document.form1.ckb[i].disabled = true;
    }
  }
}
