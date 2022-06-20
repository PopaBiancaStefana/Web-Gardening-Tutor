const http = require("http");
const url = require("url");
const path = require("path");
const fs = require("fs");
// const StringDecoder = require("string_decoder").StringDecoder;
const util = require("util");

const fileController = require("./controllers/staticFileController");
const userController = require("./controllers/userController");
const courseController = require("./controllers/courseController");
const { createNullProtoObjWherePossible } = require("ejs/lib/utils");

require("dotenv").config();

let port = process.env.PORT || 1234;
let host = process.env.HOST;

const server = http.createServer((req, res) => {

    let parsedUrl = url.parse(req.url, true);
    let urlPath = parsedUrl.path.replace(/^\/+|\/+$/g, ""); //sterge slash-urile de la inceput si sfarsit
    if(urlPath == "")
        urlPath = "home"

    let qs = parsedUrl.query;
    let headers = req.headers;
    let method = req.method.toLocaleLowerCase();

    let payload = '';
    console.log(urlPath + ' ' + method);
    req.on("data", chunk => {
        payload += chunk.toString();
    });
    req.on("end", () => {
        let parsedPayload;
        if(payload != '')
            parsedPayload = JSON.parse(payload);
        console.log('payload: '+ payload);

        let data = {
            path: urlPath,
            qureyString: qs,
            headers: headers,
            method : method,
            payload: parsedPayload
        };
        // console.log(data.payload);

        switch (method) {
            case 'get' : 
                {
                    let route = null;
                    Object.keys(getRoutes).every((key) => {

                        console.log(key + new RegExp(key).test(urlPath));
                        if(new RegExp(key).test(urlPath))
                        {
                            route = getRoutes[key];
                            return false; //break
                        }
                        return true; //continue
                    })

                    // if(urlPath in getRoutes)
                    // {
                    //     route = getRoutes[urlPath];
                    // } else {
                    //     route = getRoutes["staticFile"];
                    // }

                    if(route == null) // daca nu s-a gasit o ruta
                    {
                        console.log("aci avem "+ urlPath);
                        route = fileController.serveFile;
                    }
                    route(data, res);
                    break;
                    
                    // //let route = getRoutes[urlPath] != "undefined" ?  getRoutes[urlPath] : getRoutes["staticFile"];
                    // route(data, res);
                    // console.log('headers: \n' + JSON.stringify(data.headers) +'\n');
                    // break;
                }
            case 'post':
                let route;
                if(urlPath in postRoutes)
                {
                    route = postRoutes[urlPath];
                } else {
                    route = (data,res) => (console.log('nimic'));
                }
                route(data, res);
                break;
        
        }
    })




})

const getRoutes = {
    "^staticFile$": fileController.serveFile,
    "^profile$": userController.getProfile,
    "^garden_manager$": fileController.restrictedFile,
    "^courses$": courseController.getCourses,
    "^courses/\\w+$": courseController.getCourse
}


const postRoutes = {
    "register" : userController.register,
    "login" : userController.login,
    "course_template": courseController.saveForm,
    "logout" : userController.logout
}


server.listen(port,host, () => console.log(`listening on  ${host}:${port}`));