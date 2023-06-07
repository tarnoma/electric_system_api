const mysql = require("mysql2")
const dbConfig = require("../config/db.config")
const connection = mysql.createConnection({
    host: dbConfig.HOST,
    user: dbConfig.USER,
    password: dbConfig.PASSWORD,
    database: dbConfig.DB
})

connection.connect(err=>{
    if(err) console.log("MYSQL connection: " + err);
    else console.log("Successfully connected to the database.");
})

module.exports = connection;