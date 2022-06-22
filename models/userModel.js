const { reject } = require("bcrypt/promises");
const db =require("../database");
const bcrypt = require('bcrypt');
const uuid = require('uuid');
const { EUCJPMS } = require("mysql/lib/protocol/constants/charsets");


 async function findByEmail(email)
{
    return new Promise((resolve,reject) => 
    {
        db.pool.query("select * from registered_users where e_mail = ?", [email], (err, data) => {
            if(err)
            {
                console.log(err);
                reject(err);
            }
    
            resolve(data);
        })
    });
    
}


async function createUser(user)
{
    console.log(user.password);
    let hashedPassword = await bcrypt.hash(user.password, 14);

    let usersWithGivenEmail;
    usersWithGivenEmail = await findByEmail(user.email);
    // console.log('am primit ' + JSON.stringify(usersWithGivenEmail));
    if(usersWithGivenEmail.length > 0)
        throw "There is already an account with this email";


    db.pool.query("insert into registered_users (name, e_mail, password, registration_date) values (?,?,?,?)" , [user.name, user.email, hashedPassword, null], (err, result) =>{
        if(err) throw err;
        console.log("user inserted");
    })
}


async function login(user)
{
    //verificam daca combinatia dintre user si parola este valida
    usersWithGivenEmail = await findByEmail(user.email);
    if(usersWithGivenEmail.length > 0){
        expectedUser = usersWithGivenEmail[0];
        let passwordsDoMatch = await bcrypt.compare(user.password, expectedUser.password)
        if(passwordsDoMatch)
        {
            //parola corespunde emailului => cream un sid
            let sid = uuid.v4();
            let cookieSession = {
                sid:sid,
                expires:new Date(+new Date()+ 12*3600*1000),
            }
            await createSession(expectedUser.id, sid);
            return cookieSession;
        }
        else return "invalid email or password";
    }
    else return "invalid email or password";


}


async function createSession(userId, sessionId)
{
    db.pool.query("insert into user_session (id_user, id_session) values (?,?)" , [userId, sessionId], (err, result) =>{
        if(err) throw err;
        console.log("session created");
    })
}


function getUserBySid(sid)
{
    return new Promise((resolve, reject) => {
        db.pool.query("select id_user from user_session where id_session = ?", [sid], (err, data) => {
            if(err) reject(err);
            resolve(data);
        })
    })
}


async function getProfile(id_user)
{
    let data ={};

        //adaugam numele si emailul
    let profileInfo = await getProfileInformation(id_user);
    Object.assign(data, profileInfo);

    let userCourses = await getUserCourses(id_user);
    //adaugam cursurile
    Object.assign(data, userCourses);

    let bookmarkedCourses = await getBookmarkedCourses(id_user);
    Object.assign(data, bookmarkedCourses);

    
    return data;
}

function getUserCourses(id_user)
{
        return new Promise((resolve, reject) => {
            db.pool.query("select c.name, cp.progress/c.checkpoints as fraction from registered_users as u join courses_in_progress as cp on u.id = cp.id_user join courses as c on cp.id_course = c.id where u.id = ?", [id_user], (err, result)=>{
                if(err) {
                    reject(err);
                    return;
                }

                let data = {};
                let myCourses = [];

                Object.keys(result).forEach( (key) => {
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


function getBookmarkedCourses(id_user)
{
        return new Promise((resolve, reject) => {
            db.pool.query("select c.name from registered_users as u join bookmarked_courses as bc on u.id = bc.id_user join courses as c on bc.id_course = c.id where u.id = ?", [id_user], (err, result)=>{
                if(err) {
                    reject(err);
                    return;
                }

                let data = {};
                let bookmarkedCourses = [];

                Object.keys(result).forEach( (key) => {
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


function getProfileInformation(id_user)
{
    return new Promise((resolve, reject) => {
        db.pool.query("select name, e_mail from registered_users where id = ?" , [id_user], (err, result) => {
            if (err){
                reject(err);
                return;
            }
            let data = {};
            Object.keys(result).forEach((key) => {
                let row = result[key];
                data.name = row.name;
                data.email = row.e_mail;  
            });
            resolve(data);
        })
    })
}

module.exports = {
    findByEmail,
    createUser, 
    login,
    getUserBySid,
    getProfile
};