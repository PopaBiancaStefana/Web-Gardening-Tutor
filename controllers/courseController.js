const courseModel = require("../models/courseModel");
const checkSession = require("../models/sessionModel").checkSession;

async function saveForm(data, res) {
  try {
    //get the id of the current user
    let result = await checkSession(data.headers);
    id = JSON.parse(result);
    data.payload.user_id = id["user_id"];

    console.log(
      "Form info: user: " +
        data.payload.user_id +
        ", progress: " +
        data.payload.progress
    );

    await courseModel.updateProgress(data.payload);

    res.setHeader("Content-type", "application/json");
    res.end(JSON.stringify({ data: data.payload }));
  } catch (err) {
    console.log(err);
    res.setHeader("Content-type", "application/json");
    res.end(JSON.stringify({ error: err }));
  }
}

async function getProgress(data, res) {
  try {
   
    //get the id of the current user
    let result = await checkSession(data.headers);
    id = JSON.parse(result);


    let info = {
      user_id: id["user_id"],
      course_name: data.headers.course,
    };

    let prog = await courseModel.geCourseProgress(info);

    console.log("The progress for course " + data.headers.course + ": " + prog);
     res.setHeader("Content-type", "application/json");
     res.end(JSON.stringify({ progress: prog }));
  } catch (err) {
     console.log(err);
     res.setHeader("Content-type", "application/json");
     res.end(JSON.stringify({ error: err }));
  }
}

module.exports = { saveForm, getProgress };
