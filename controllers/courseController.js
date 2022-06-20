const courseModel = require("../models/courseModel");
const staticFileController = require("./staticFileController");

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


 async function getCourses(data, res)
{
    let result = await staticFileController.restrictedFile(data, res);
    if("error" in result) // nu a existat sesiune si userul a fost deja redirectat catre pagina de login
        return;

    staticFileController.serveFile(data,res);
}

function getCourse(data, res)
{
    console.log("am ajuns aici " + data.path);
    let course_name =  data.path.split('/')[1];
    console.log('nume curs' + course_name);
}

module.exports = {saveForm, getProgress, getCourses, getCourse}