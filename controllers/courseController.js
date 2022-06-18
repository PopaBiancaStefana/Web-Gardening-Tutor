const courseModel = require("../models/courseModel");
const checkSession = require("../models/sessionModel").checkSession;

async function saveForm(data, res) {
  try {
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

//NEED TO BE MODIFIED
async function getProgress(data, res) {
  try {
    let progress = await courseModel.geCourseProgress(data.payload);

    res.setHeader("Content-type", "application/json");
    res.end(JSON.stringify({ progress: progress }));
  } catch (err) {
    console.log(err);
    res.setHeader("Content-type", "application/json");
    res.end(JSON.stringify({ error: err }));
  }
}

module.exports = { saveForm, getProgress };
