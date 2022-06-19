const db = require("../database");

async function getGarden(user_id) {
    return new Promise((resolve, reject) => {
        db.pool.query(
            "select plant_name, date_format(last_interaction, '%Y-%m-%d') as last_interaction, date_format(due_date, '%Y-%m-%d') as due_date, stage, interaction from garden_manager where id_user = ?",
            [user_id],
            (err, data) => {
                if (err) {
                    console.log(err);
                    reject(err);
                }
                console.log("Plants: " + JSON.stringify(data));

                resolve(data);
            }
        );
    });
}

async function saveGarden(info) {
    // Info contains: plant_name, last_interaction, due_date, stage,
    // interaction, id_user

    let plantByNewName = await findPlant(info.plant_name, info.id_user);
    if (plantByNewName.length > 0 && info.plant_name != info.old_plant_name)
        throw "There is already a plant with this name";

    db.pool.query(
        "insert into garden_manager(plant_name, last_interaction, due_date, stage, interaction, id_user) values (?,date_format(?, '%Y-%m-%d'),date_format(?, '%Y-%m-%d'),?,?,?)",
        [
            info.plant_name,
            info.last_interaction,
            info.due_date,
            info.stage,
            info.interaction,
            info.id_user,
        ],
        (err) => {
            if (err) throw err;
            console.log("Plant saved.");
        }
    );

}

async function updateGarden(info) {
    // Info contains: plant_name, last_interaction, due_date, stage,interaction, id_user

    let plantByNewName = await findPlant(info.plant_name, info.id_user);
    if (plantByNewName.length > 0 && info.plant_name != info.old_plant_name)
        throw "There is already a plant with this name";

    db.pool.query("update garden_manager set plant_name = ?, last_interaction = ?, due_date = ?, stage = ?, interaction = ? where   plant_name = ? and id_user = ?",
        [info.plant_name, info.last_interaction, info.due_date, info.stage, info.interaction, info.old_plant_name, info.id_user],
        (err) => {
            if (err) throw err;
            console.log("Plant updated.");
        });
}

async function findPlant(name, user) {
    return new Promise((resolve, reject) => {
        db.pool.query("select * from garden_manager where plant_name = ? and id_user = ?", [name, user], (err, data) => {
            if (err) {
                console.log(err);
                reject(err);
            }
            resolve(data);
        })
    });
}

async function deleteGarden(plant, user_id) {
    return new Promise((resolve, reject) => {
        db.pool.query("delete from garden_manager where plant_name = ? and id_user = ?", [plant, user_id], (err, data) => {
            if (err) {
                console.log(err);
                reject(err);
            }
            console.log(JSON.stringify(data));
            resolve(data);
        })
    });

}

module.exports = { getGarden, saveGarden, updateGarden, deleteGarden };
