const http = require("http");
const url = require("url");
const path = require("path");
const fs = require("fs");
// const StringDecoder = require("string_decoder").StringDecoder;
const util = require("util");
const lookup = require("mime-types").lookup;
require("dotenv").config();

let port = process.env.PORT || 1234;
let host = process.env.HOST;

const server = http.createServer((req, res) => {

    let parsedUrl = url.parse(req.url, true);
    let urlPath = parsedUrl.path.replace(/^\/+|\/+$/g, ""); //sterge slash-urile de la inceput si sfarsit
    if(urlPath == "")
        urlPath = "home.html"

    let file = path.join(__dirname, 'public', urlPath);
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

})

server.listen(port,host, () => console.log(`listening on  ${host}:${port}`));