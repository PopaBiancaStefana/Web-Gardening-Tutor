const db = require("../database");

async function getGarden(user_id) {
    return new Promise((resolve, reject) => {
        db.pool.query("select plant_name, date_format(last_interaction, '%Y-%m-%d') as last_interaction, date_format(due_date, '%Y-%m-%d') as due_date, stage, interaction from garden_manager where id_user = ?", [user_id], (err, data) => {
            if (err) {
                console.log(err);
                reject(err);
            }
            console.log("Plants: " + JSON.stringify(data));

            resolve(data);
        })
    });
}

async function saveGarden(info) {
    // Info contains: plant_name, last_interaction, due_date, stage,
    // interaction, id_user
    return new Promise((resolve, reject) => {
        db.pool.query("insert into garden_manager(plant_name, last_interaction, due_date, stage, interaction, id_user) values (?,date_format(?, '%Y-%m-%d'),date_format(?, '%Y-%m-%d'),?,?,?)", [info.plant_name, info.last_interaction, info.due_date, info.stage, info.interaction, info.id_user], (err, data) => {
            if (err) {
                console.log(err);
                reject(err);
            }
            console.log(JSON.stringify(data));
            resolve(data);
        })
    });

}

module.exports = { getGarden, saveGarden };