const { reject } = require("bcrypt/promises");
const db =require("../database");
const bcrypt = require('bcrypt');
const uuid = require('uuid');


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
            //console.log(JSON.stringify(data));
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

module.exports = {
    findByEmail,
    createUser, 
    login,
    getUserBySid
};