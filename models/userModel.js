const { reject } = require("bcrypt/promises");
const db =require("../database");
const bcrypt = require('bcrypt');


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
    let hashedPassword = await bcrypt.hash('alalala', 14);

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


module.exports = {findByEmail, createUser};