const userModel = require("../models/userModel");
const sessionModel = require("../models/sessionModel");

async function register(data, res)
{
    try{
        
        await userModel.createUser(data.payload);
        // console.log("sunt aici: " + JSON.stringify(data.payload));

        // res.writeHead(201, {"Content-type" : "applicaton/json"});
        // res.end( {msg: "user registered"});
        res.setHeader("Content-type", "application/json");
        res.writeHead(201, "user created");
        res.end(JSON.stringify({data: data.payload }));
    } catch(err) {
        console.log(err);
        res.setHeader("Content-type", "application/json");
        res.writeHead(400, "email used");
        res.end(JSON.stringify({error: err }));
    }
    
}



async function login(data,res) {
    let msg = await userModel.login(data.payload);
    if(typeof msg === 'object' && msg !== null)
    {
        //logare cu succes, trimiem cookieul catre client
        res.setHeader("Set-Cookie", `sid=${msg.sid}`);
        //res.writeHead(301, {Location: 'profile'});
        res.writeHead(201);
        res.end("logged in successfuly");
    }
    else{
        res.writeHead(401, "bad credentials"); //unauthorized
        res.end(JSON.stringify({error : msg}));
    }
}


async function logout(data,res)
{
    //preluam sidul de la client, si stergem sesiunea din baza de date
    let sesCookie = headers.cookie.split('=');
    let sid=sesCookie[1];
    let userId = await userModel.getUserBySid(sid);
    sessionModel.deleteUserSession(userId);

    res.setHeader("Set-Cookie", "sid=\'\'");
    res.writeHead(301, {Location: 'home'});
    res.end('logged out');
}

module.exports = {register, login, logout};