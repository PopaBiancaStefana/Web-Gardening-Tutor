const userModel = require("../models/userModel");

async function register(data, res)
{
    try{
        
        await userModel.createUser(data.payload);
        // console.log("sunt aici: " + JSON.stringify(data.payload));

        // res.writeHead(201, {"Content-type" : "applicaton/json"});
        // res.end( {msg: "user registered"});
        res.setHeader("Content-type", "application/json");
        res.end(JSON.stringify({data: data.payload }));
    } catch(err) {
        console.log(err);
        res.setHeader("Content-type", "application/json");
        res.end(JSON.stringify({error: err }));
    }
    
}

module.exports = {register};