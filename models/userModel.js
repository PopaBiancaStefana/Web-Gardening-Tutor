const { reject } = require("bcrypt/promises");
const db = require("../database");
const bcrypt = require('bcrypt');
const uuid = require('uuid');
const { EUCJPMS } = require("mysql/lib/protocol/constants/charsets");
const fs = require("fs");
const { isStringObject } = require("util/types");
const { info } = require("console");
const path = require("path");
const { userInfo } = require("os");
const checkSession = require('./sessionModel').checkSession;



async function findByEmail(email) {
    return new Promise((resolve, reject) => {
        db.pool.query("select * from registered_users where e_mail = ?", [email], (err, data) => {
            if (err) {
                console.log(err);
                reject(err);
            }

            resolve(data);
        })
    });

}


async function createUser(user) {
    console.log(user.password);
    let hashedPassword = await bcrypt.hash(user.password, 14);

    let usersWithGivenEmail;
    usersWithGivenEmail = await findByEmail(user.email);
    // console.log('am primit ' + JSON.stringify(usersWithGivenEmail));
    if (usersWithGivenEmail.length > 0)
        throw "There is already an account with this email";


    let profile_information = {
        photo_path: "images/avatars/avatar.webp",
        about: "",
        profession: "",
        registration_date: new Date(),
        achievements: [
            {
                description: "Signed up",
                photo_src: "images/achievements/signed_in.webp"
            }
        ],
        finished_courses: 0
    }

    let file_name = uuid.v4() + '.json';
    let info_path = path.join(__dirname, "../public/users", file_name);
    fs.writeFile(info_path, JSON.stringify(profile_information), (err) => {
        if (err) {
            console.log("eroare la scriere in fisier");
            throw err;
        }
    })


    db.pool.query("insert into registered_users (name, e_mail, password, profile_information) values (?,?,?,?)", [user.name, user.email, hashedPassword, file_name], (err, result) => {
        if (err) throw err;
        console.log("user inserted");
    })
}


async function login(user) {
    //verificam daca combinatia dintre user si parola este valida
    usersWithGivenEmail = await findByEmail(user.email);
    if (usersWithGivenEmail.length > 0) {
        expectedUser = usersWithGivenEmail[0];
        let passwordsDoMatch = await bcrypt.compare(user.password, expectedUser.password)
        if (passwordsDoMatch) {
            //parola corespunde emailului => cream un sid
            let sid = uuid.v4();
            let cookieSession = {
                sid: sid,
                expires: new Date(+new Date() + 12 * 3600 * 1000),
            }
            await createSession(expectedUser.id, sid);
            return cookieSession;
        }
        else return "invalid email or password";
    }
    else return "invalid email or password";


}


async function createSession(userId, sessionId) {
    db.pool.query("insert into user_session (id_user, id_session) values (?,?)", [userId, sessionId], (err, result) => {
        if (err) throw err;
        console.log("session created");
    })
}




async function getProfile(id_user) {
    let data = {};

    //adaugam informatiile despre profil
    let profileInfo = await getProfileInformation(id_user);
    data.profile_information = profileInfo;

    let userCourses = await getUserCourses(id_user);
    //adaugam cursurile
    Object.assign(data, userCourses);

    let bookmarkedCourses = await getBookmarkedCourses(id_user);
    Object.assign(data, bookmarkedCourses);


    return data;
}

function getUserCourses(id_user) {
    return new Promise((resolve, reject) => {
        db.pool.query("select c.name, cp.progress/c.checkpoints as fraction from registered_users as u join courses_in_progress as cp on u.id = cp.id_user join courses as c on cp.id_course = c.id where u.id = ?", [id_user], (err, result) => {
            if (err) {
                reject(err);
                return;
            }

            let data = {};
            let myCourses = [];

            Object.keys(result).forEach((key) => {
                let row = result[key];
                let course = {};
                course.title = row.name;
                course.progress = row.fraction;

                myCourses.push(course);
            })

            data.my_courses = myCourses;
            resolve(data);

        });
    });
}


function getBookmarkedCourses(id_user) {
    return new Promise((resolve, reject) => {
        db.pool.query("select c.name from registered_users as u join bookmarked_courses as bc on u.id = bc.id_user join courses as c on bc.id_course = c.id where u.id = ? and bc.bookmarked = 1", [id_user], (err, result) => {
            if (err) {
                reject(err);
                return;
            }

            let data = {};
            let bookmarkedCourses = [];

            Object.keys(result).forEach((key) => {
                let row = result[key];
                let course = {};
                course.title = row.name;

                bookmarkedCourses.push(course);
            })

            data.bookmarked = bookmarkedCourses;
            resolve(data);

        });
    });
}


function getProfileInformation(id_user) {
    return new Promise((resolve, reject) => {
        db.pool.query("select name, e_mail, profile_information from registered_users where id = ?", [id_user], (err, result) => {
            if (err) {
                reject(err);
                return;
            }
            let data = {};
            let profileDetails = {};
            Object.keys(result).forEach((key) => {
                let row = result[key];
                data.name = row.name;
                data.email = row.e_mail;

                if (row.profile_information) {
                    file = path.join(__dirname, "../public/users", row.profile_information);
                    profileDetails = require(file);


                }
                Object.keys(profileDetails).forEach((key) => {
                    data[key] = profileDetails[key];
                })

            });
            console.log("trimitem data " + JSON.stringify(data));
            resolve(data);
        })
    })
}


async function saveInformation(userId, information) {
    //get info_file path
    let file_path = await getFileName(userId);
    console.log('path ' + file_path);
    file_path = path.join(__dirname, "../public/users", file_path);

    let infoObj = require(file_path);

    //editam jsou ul de pe disc
    Object.keys(information).forEach((key) => {
        infoObj[key] = information[key];
    })

    fs.writeFile(file_path, JSON.stringify(infoObj), (err) => {
        if (err)
            throw err;
        console.log("am modificat! - " + JSON.stringify(information));
    })
}

function getFileName(userId) {
    return new Promise((resolve, reject) => {
        db.pool.query("select profile_information from registered_users where id = ?", [userId], (err, data) => {
            if (err) {
                console.log(err);
                reject(err);
                return;
            }
            resolve(data[0].profile_information);
        })
    });
}

async function incrementFinishedCourses(userId) {
    let file_path = await getFileName(userId);
    file_path = path.join(__dirname, "../public/users", file_path);

    let userInformation = require(file_path);

    userInformation.finished_courses = userInformation.finished_courses + 1;
    console.log('verif ' + userInformation.finished_courses);
    if (userInformation.finished_courses == 1) {

        userInformation.achievements.push({
            photo_src: "images/achievements/first_course.webp",
            description: "Finished first course"
        })
    }

    if (userInformation.finished_course == 4) {
        userInformation.achievements.push({
            photo_src: "images/achievements/all_courses.webp",
            description: "Finished all courses"
        })
    }

    fs.writeFile(file_path, JSON.stringify(userInformation), (err) => {
        if (err) {
            console.log("eroare la scriere in fisier");
            throw err;
        }
        console.log("scriem " + JSON.stringify(userInformation))
    })

}

async function saveImage(data) {
    let base64code = data.payload.image.split(',')[1];

    //scriem pe disc imaginea
    let imageName = uuid.v4() + '.webp';
    let imagePath = path.join(__dirname, '../public/images/avatars', imageName);
    fs.writeFile(imagePath, base64code, 'base64', (err) => {
        if (err) {
            console.log(err);
            throw err;
        }
    });

    //put image path in user information json

    let result = await checkSession(data.headers);
    let user_id = JSON.parse(result).user_id;


    let info_file_path = await getFileName(user_id);
    info_file_path = path.join(__dirname, "../public/users", info_file_path);

    let userInformation = require(info_file_path);
    userInformation.photo_path = path.join('images', 'avatars', imageName);


    fs.writeFile(info_file_path, JSON.stringify(userInformation), (err) => {
        if (err) {
            console.log("eroare la scriere in fisier");
            throw err;
        }
    })
}

module.exports = {
    findByEmail,
    createUser,
    login,
    getProfile,
    saveInformation,
    incrementFinishedCourses,
    saveImage
};