const path = require("path");
const fs = require("fs");
const lookup = require("mime-types").lookup;
const checkSession = require('../models/sessionModel').checkSession;


function serveFile(data, res)
{
    let file = path.join(__dirname, '../public', data.path);
    if(!file.includes("."))
        file += ".html";

    console.log(file);
    fs.readFile(file, (err, content) =>{
        if(err)
        {
            console.log(`File not found ${file}`)
            res.writeHead(404, 'not found');
            res.end();
        } else {
            console.log(`Returning ${file}`);
            
            // res.setHeader("X-Content-Type-Options", "nosniff"); //nu inecerca sa deduci mimetype ul

            let mime = lookup(data.path);
            res.writeHead(200, {"Content-type": mime});
            res.end(content);
        }
    })
}



async function restrictedFile(data, res)
{

    let result = await checkSession(data.headers)
    .catch((err) => {
        res.writeHead(303, {Location: 'login'});
        res.end();
        return {error: "no session"};
    });

    

    console.log("blablablasdf " + result );


    if("user_id" in JSON.parse(result)) // exista sesiunea pentru client
    {
        return result;
    }
    else{
        res.writeHead(303, {Location: 'login'});
        res.end();
        return {error: "no session"};
    }
   
}

module.exports = {serveFile, restrictedFile}