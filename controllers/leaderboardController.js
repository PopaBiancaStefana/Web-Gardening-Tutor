const leaderboardModel = require("../models/leaderboardModel");
const ejs = require("ejs");
const path = require("path");

async function gettopUsers(data, res) {

    let tableData = await leaderboardModel.topUsers(data.payload);

    console.log(tableData);
    try {

        ejs.renderFile(path.join(__dirname, "/../views/leaderboard.ejs"), tableData, {}, (err, result) => {
            if (err)
                throw err;

            res.writeHead(200, { "Content-type": "text/html" });
            res.end(result);
        });
    } catch (err) {
        console.log(err);
        res.writeHead(500);
        res.end();
    }
}

module.exports = { gettopUsers };
