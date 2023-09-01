const hostname = '127.0.0.1';
const port = 3000;

const http = require('http');
const path = require('path');
// const fs = require('fs');

const express = require('express');
const app = express();

const db = require('./db.js');

app.use(express.static(path.join(__dirname, '../../public')));
app.set('views', path.join(__dirname, '/../../public/views/'));
app.set('view engine', 'ejs');

http.createServer(app)
.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});

app.get("/app", (req, res) => {
    let dataTabs = "";

    const category = req.query.category || 'war';
    const sql = "SELECT html_data FROM data_tab where category = ?";

    db.connection.query(sql, [category],function (err, result) {
        if (err) {
            throw err;
        }

        let htmlData = Object.values(JSON.parse(JSON.stringify(result)));

        htmlData.forEach((v) => {
            dataTabs += v['html_data'];
        });

        res.render('pages/index.ejs', {dataTabs: dataTabs});
    });
});

// app.get('/app/123', (req, res) => {
//     res.statusCode = 200;
//     res.setHeader('Content-Type', 'text/plain');
//     res.end('Hello World');
// });
