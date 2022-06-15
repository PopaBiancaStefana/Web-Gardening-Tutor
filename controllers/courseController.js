const courseModel = require("../models/courseModel");

async function saveForm(data, res)
{

    try {
        await courseModel.updateProgress(data.payload);

        res.setHeader("Content-type", "application/json");
        res.end(JSON.stringify({data: data.payload }));
    } catch(err) {
        console.log(err);
        res.setHeader("Content-type", "application/json");
        res.end(JSON.stringify({error: err }));
    }
}



//NEED TO BE MODIFIED
async function getProgress(data, res)
{

    try {
        let progress = await courseModel.geCourseProgress(data.payload);

        res.setHeader("Content-type", "application/json");
        res.end(JSON.stringify({ progress: progress }));
    } catch(err) {
        console.log(err);
        res.setHeader("Content-type", "application/json");
        res.end(JSON.stringify({error: err }));
    }
}

module.exports = {saveForm, getProgress}