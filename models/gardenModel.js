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
  return new Promise((resolve, reject) => {
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
      (err, data) => {
        if (err) {
          console.log(err);
          reject(err);
        }
        console.log(JSON.stringify(data));
        resolve(data);
      }
    );
  });
}

async function updateGarden(info) {
  // Info contains: plant_name, last_interaction, due_date, stage,interaction

  let plantByNewName = await findPlant(info.plant_name);
  if (plantByNewName.length > 0 && info.plant_name != info.old_plant_name)
    throw "There is already a plant with this name";

  db.pool.query("update garden_manager set plant_name = ?, last_interaction = ?, due_date = ?, stage = ?, interaction = ? where   plant_name = ?",
    [info.plant_name, info.last_interaction, info.due_date, info.stage, info.interaction, info.old_plant_name],
    (err) => {
      if (err) throw err;
      console.log("Plant updated.");
    });
}

async function findPlant(name) {
  return new Promise((resolve, reject) => {
    db.pool.query("select * from garden_manager where plant_name = ?", [name], (err, data) => {
      if (err) {
        console.log(err);
        reject(err);
      }
      resolve(data);
    })
  });
}

module.exports = { getGarden, saveGarden, updateGarden };
