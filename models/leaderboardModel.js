const db = require("../database");
const path = require("path");


async function topUsers() {
    let data = {};

    //adaugam array-ul de useri
    let usersTable = await topUsersTable();
    Object.assign(data, usersTable);

    return data;
}

async function topUsersTable() {
    return new Promise((resolve, reject) => {
        db.pool.query("select * from (select r.profile_information , r.name,  ROW_NUMBER() over (order by count(c.finished) desc) rownum, count(c.finished) as 'finished_courses' from registered_users r join courses_in_progress c on r.id = c.id_user and c.finished = 1 group by r.name, c.finished, r.photo_path) as q where rownum<=10;", [], (err, result) => {
            if (err) {
                console.log(err);
                reject(err);
                return;
            }
            let data = {};
            let topUsers = [];

            Object.keys(result).forEach((key) => {
                let row = result[key];
                let user = {};

                file = path.join(__dirname, "../public/users", row.profile_information);
                profileDetails = require(file);
                user.photo_path = profileDetails = profileDetails.photo_path;

                // if (row.photo_path == null) {
                //     user.photo_path = "";
                // }
                // else {
                //     user.photo_path = row.photo_path;
                // }
                user.name = row.name;
                user.rank = row.rownum;
                user.finished_courses = row.finished_courses;

                topUsers.push(user);

            })

            data.top_users = topUsers;
            resolve(data);
        })
    });

}

module.exports = { topUsers };