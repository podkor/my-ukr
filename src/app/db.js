const mysql = require('mysql');
require('dotenv').config({
    path: __dirname + '/../environments/.env.' + process.env.NODE_ENV
});

const connection = mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_DATABASE
});

module.exports = {
    connection: connection
}
