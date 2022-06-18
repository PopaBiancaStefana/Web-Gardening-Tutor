const userModel = require("../models/userModel");
const sessionModel = require("../models/sessionModel");
const { restrictedFile } = require("./staticFileController");
const ejs = require("ejs");

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
        console.log('suntem pe aici :' + JSON.stringify(msg));
        //logare cu succes, trimiem cookieul catre client
        res.setHeader("Set-Cookie", `sid=${msg.sid}`);
        //res.writeHead(307, {Location: 'profile'});
        res.writeHead(201);
        res.end(JSON.stringify({data: "logged in"}));
    }
    else{
        res.writeHead(401, "bad credentials"); //unauthorized
        res.end(JSON.stringify({error : msg}));
    }
}


async function logout(data,res)
{
    //preluam sidul de la client, si stergem sesiunea din baza de date
    let sesCookie = data.headers.cookie.split('=');
    let sid=sesCookie[1];
    console.log('delogam userul cu sid ul ' + sid);

    sessionModel.deleteUserSession(sid);

    res.setHeader("Set-Cookie", "sid=\'\'");
    res.writeHead(303, {Location: 'home'});
    res.end('logged out');
}


async function getProfile(data, res)
{
    let result = await restrictedFile(data, res);
    if("error" in JSON.parse(result)) // nu a existat sesiune si userul a fost deja redirectat catre pagina de login
        return;

    let data = await userModel.getProfile(JSON.parse(result).user_id);
    
    //todo render profile view
    

}

module.exports = {register, login, logout, getProfile};