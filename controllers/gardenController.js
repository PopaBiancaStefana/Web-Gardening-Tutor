const gardenModel = require("../models/gardenModel");
const checkSession = require("../models/sessionModel").checkSession;
const { restrictedFile } = require("./staticFileController");
const ejs = require("ejs");
const path = require("path");

async function savePlants(data, res) {
    try {
        //get the id of the current user
        let result = await checkSession(data.headers);
        id = JSON.parse(result);
        data.payload.id_user = id["user_id"];

        console.log(data.payload);

        await gardenModel.saveGarden(data.payload);
        console.log("Plant saved.");
        res.setHeader("Content-type", "application/json");
        res.end(JSON.stringify({ data: "Plant saved." }));
    } catch (err) {
        console.log(err);
        res.setHeader("Content-type", "application/json");
        res.end(JSON.stringify({ error: err }));
    }
}

async function getPlants(data, res) {

    let result = await restrictedFile(data, res);

    if ("error" in result)
        return;

    let message = await gardenModel.getGarden(result.user_id);
    console.log(message);
    console.log("Showing plants from garden.");

    try {
        ejs.renderFile(path.join(__dirname, "/../views/gardenmanager.ejs"), message, {}, (err, result) => {
            if (err)
                throw err;

            res.writeHead(200, { "Content-type": "text/html" });
            res.end(result);
        });
    } catch (err) {
        console.log(err);
        res.setHeader("Content-type", "application/json");
        res.end(JSON.stringify({ error: err }));
    }
}

async function updatePlants(data, res) {
    try {
        //get the id of the current user
        let result = await checkSession(data.headers);
        id = JSON.parse(result);
        data.payload.id_user = id["user_id"];

        await gardenModel.updateGarden(data.payload);

        res.setHeader("Content-type", "application/json");
        res.end(JSON.stringify({ data: "Plant updated." }));
    } catch (err) {
        console.log(err);
        res.setHeader("Content-type", "application/json");
        res.end(JSON.stringify({ error: err }));
    }
}

async function deletePlants(data, res) {
    try {
        //get the id of the current user
        let result = await checkSession(data.headers);
        id = JSON.parse(result);

        await gardenModel.deleteGarden(data.headers.plant_name, id["user_id"]);
        console.log("Plant deleted: ", data.headers.plant_name, " User id: ", id["user_id"]);

        res.setHeader("Content-type", "application/json");
        res.end(JSON.stringify({ data: "Plant deleted." }));
    } catch (err) {
        console.log(err);
        res.setHeader("Content-type", "application/json");
        res.end(JSON.stringify({ error: err }));
    }

}

module.exports = { getPlants, savePlants, updatePlants, deletePlants };
