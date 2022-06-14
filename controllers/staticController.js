const fs = require('fs');
const path = require('path');
const lookup = require("mime-types").lookup;

async function getHomePage(req, res)
{
    try {
        let file = path.join(__dirname, '../public', 'home.html');
        console.log(file);

        fs.readFile(file, (err, content) =>{
            if(err)
            {
                console.log(`File not found ${file}`)
                res.writeHead(404);
                res.end();
            } else {
                console.log(`Returning home.html`);
                
                // res.setHeader("X-Content-Type-Options", "nosniff"); //nu inecerca sa deduci mimetype ul
                
                let mime = lookup()
                res.writeHead(200, {"Content-type": "text/html"});
                res.end(content);
            }
        })
    } catch (error){
        console.log(error);
    }
}

module.exports = {
    getHomePage
}