const db =require("../database");


async function checkSession(headers)
{
    if(!("cookie" in headers))
    {
        return JSON.stringify({error:'no session'})
    }

    let sesCookie = headers.cookie.split('=');
    let sid=sesCookie[1];


    //cautam sid ul in bd
    let users = await getUserBySid(sid)
    .catch((err) => {
        console.log("eroarea este "+ err);
        return JSON.stringify({error: err}) })
    
    if(users.length <=0 )
    {
        console.log("nu e nimeni");
        return JSON.stringify({error: "no user with given sid"});
    }

    console.log('Current user id: ' + users[0].id_user);

    return JSON.stringify({user_id: users[0].id_user});
    
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

function deleteUserSession(sid)
{
    db.pool.query("delete from user_session where id_session = ? " , [sid], (err, result) =>{
        if(err) throw err;
        console.log("session deleted");
    })
}

module.exports = {
    checkSession,
    deleteUserSession
}