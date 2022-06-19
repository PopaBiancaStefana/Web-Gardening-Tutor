const leaderboardModel = require("../models/leaderboardModel");

async function topUsers(data, res) {
    try {
        let msg = await leaderboardModel.showTopUsers(data.payload);
        console.log("Rezultat returnat " + JSON.stringify(msg));
        res.setHeader("Content-type", "application/json");
        res.end(JSON.stringify({ data: msg }));
    } catch (err) {
        console.log(err);
        res.setHeader("Content-type", "application/json");
        res.end(JSON.stringify({ error: err }));
    }

}

module.exports = { topUsers };
