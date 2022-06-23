const userModel = require("../models/userModel");
const sessionModel = require("../models/sessionModel");
const { restrictedFile } = require("./staticFileController");
const ejs = require("ejs");
const path = require("path"); 
const { write } = require("fs");
const { compareSync } = require("bcrypt");
const checkSession = require('../models/sessionModel').checkSession;


async function register(data, res)
{
    try{
        
        await userModel.createUser(data.payload);
    
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
        console.log('in login:' + JSON.stringify(msg));
        //logare cu succes, trimiem cookieul catre client
        res.setHeader("Set-Cookie", `sid=${msg.sid}`);
        //res.writeHead(307, {Location: 'profile'});
        res.writeHead(201,{"Content-type": "application/json"});
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
    if("error" in result) // nu a existat sesiune si userul a fost deja redirectat catre pagina de login
        return;

    let profileData = await userModel.getProfile(result.user_id);

    
    console.log("Profile Data: " , profileData);

    try{
        ejs.renderFile(path.join(__dirname, "/../views/profile.ejs"), profileData, {}, (err, result) =>{
            if(err)
                throw err;
            
            res.writeHead(200, {"Content-type":"text/html"});
            res.end(result);
        });
    } catch (err)
    {
        console.log(err);
        res.writeHead(500);
        res.end();
    }
    

}


async function saveInformation(data, res)
{
    //console.log("informatii" + JSON.stringify(data.payload));
    let result = await checkSession(data.headers)
    .catch((err) => {
        res.writeHead(500); //server error
        res.end();
        return {error: "no session"};
    });

    result = JSON.parse(result);
    let userId;
    if("user_id" in result) // exista sesiunea pentru client
    {
        userId = result.user_id;
    }
    else{
        res.writeHead(401);
        res.end();
        return {error: "no session"};
    }

    userModel.saveInformation(userId, data.payload);

}

module.exports = {register, login, logout, getProfile, saveInformation};