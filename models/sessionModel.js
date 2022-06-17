const userModel = require("../models/userModel");

async function checkSession(headers)
{
    if(!("cookie" in headers))
    {
        return JSON.stringify({error:'no session'})
    }

    let sesCookie = headers.cookie.split('=');
    let sid=sesCookie[1];


    //cautam sid ul in bd
    let userId = await userModel.getUserBySid(sid)
    .catch((err) => {return JSON.stringify({error: err}) })

    return JSON.stringify({user_id: userId});
    
}

function deleteUserSession(userId)
{
    db.pool.query("delete from user_seesion where id_user = ? " , [userId], (err, result) =>{
        if(err) throw err;
        console.log("session deleted");
    })
}

module.exports = {
    checkSession,
    deleteUserSession
}