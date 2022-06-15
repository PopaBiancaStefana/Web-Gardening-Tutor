const mysql = require("mysql");

const pool = mysql.createPool({
    connectionLimit : 100,
    host : "localhost",
    user : "student",
    password : "student",
    database : "gardening",
    debug : false
});

module.exports = {pool};