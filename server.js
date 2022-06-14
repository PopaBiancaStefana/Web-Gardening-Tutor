const http = require("http");
const url = require("url");
const path = require("path");
const fs = require("fs");
// const StringDecoder = require("string_decoder").StringDecoder;
const util = require("util");
const fileController = require("./controllers/staticFileController");
require("dotenv").config();

let port = process.env.PORT || 1234;
let host = process.env.HOST;

const server = http.createServer((req, res) => {

    let parsedUrl = url.parse(req.url, true);
    let urlPath = parsedUrl.path.replace(/^\/+|\/+$/g, ""); //sterge slash-urile de la inceput si sfarsit
    if(urlPath == "")
        urlPath = "home.html"

    let qs = parsedUrl.query;
    let headers = parsedUrl.heaeders;
    let method = req.method.toLocaleLowerCase();

    console.log(urlPath);
    req.on("data", function(){
        
    });
    req.on("end", function(){
        let data = {
            path: urlPath,
            qureyString: qs,
            headers: headers,
            method : method
        };

        switch (method) {
            case 'get' : 
                {
                    let route;
                    if(urlPath in getRoutes)
                    {
                        route = getRoutes[urlPath];
                    } else {
                        route = getRoutes["staticFile"];
                    }

                    //let route = getRoutes[urlPath] != "undefined" ?  getRoutes[urlPath] : getRoutes["staticFile"];
                    route(urlPath, res);
                }
            case 'post':
            
        }
    })




})

const getRoutes = {
    "home.html": fileController.serveFile,
    "staticFile": fileController.serveFile
}





server.listen(port,host, () => console.log(`listening on  ${host}:${port}`));