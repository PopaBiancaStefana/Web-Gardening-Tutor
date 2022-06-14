const path = require("path");
const fs = require("fs");
const lookup = require("mime-types").lookup;


function serveFile(urlPath, res)
{
    let file = path.join(__dirname, '../public', urlPath);
    console.log(file);
    fs.readFile(file, (err, content) =>{
        if(err)
        {
            console.log(`File not found ${file}`)
            res.writeHead(404);
            res.end();
        } else {
            console.log(`Returning ${urlPath}`);
            
            // res.setHeader("X-Content-Type-Options", "nosniff"); //nu inecerca sa deduci mimetype ul

            let mime = lookup(urlPath);
            res.writeHead(200, {"Content-type": mime});
            res.end(content);
        }
    })
}

module.exports = {serveFile}