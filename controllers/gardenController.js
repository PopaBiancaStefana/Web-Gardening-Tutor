const gardenModel = require("../models/gardenModel");
const checkSession = require("../models/sessionModel").checkSession;

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
    try {
        //get the id of the current user
        let result = await checkSession(data.headers);
        id = JSON.parse(result);

        let message = await gardenModel.getGarden(id["user_id"]);
        console.log("Showing plants from garden.");
        res.setHeader("Content-type", "application/json");
        res.end(JSON.stringify({ data: message }));
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
