const db = require("../database");

async function showTopUsers() {
    return new Promise((resolve, reject) => {
        db.pool.query("select * from (select r.photo_path, r.name,  ROW_NUMBER() over (order by count(c.finished) desc) rownum, count(c.finished) as 'finished_courses' from registered_users r join courses_in_progress c on r.id = c.id_user and c.finished = 1 group by r.name, c.finished, r.photo_path) as q where rownum<=10;", [], (err, data) => {
            if (err) {
                console.log(err);
                reject(err);
            }
            console.log(JSON.stringify(data));
            resolve(data);
        })
    });

}

module.exports = { showTopUsers };