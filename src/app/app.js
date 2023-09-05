const hostname = '127.0.0.1';
const port = 3000;

const http = require('http');
const path = require('path');
// const fs = require('fs');

const express = require('express');
const app = express();

const db = require('./db.js');
const dataTabTitles = require('./dataTab.js');

app.use(express.static(path.join(__dirname, '../../public')));
app.set('views', path.join(__dirname, '/../../public/views/'));
app.set('view engine', 'ejs');

app.use(express.json());
app.use("/app/auth", require("./auth/route"))

http.createServer(app)
.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});

app.get("/app", (req, res) => {
    let dataTabs = "";

    const category = req.query.category || 'war';
    const sql = "SELECT id, html_data, height, width FROM data_tab where category = ?";

    db.connection.query(sql, [category], function (err, result) {
        let log = '';
        if (err) {
            throw err;
        }

        let dataTab = Object.values(JSON.parse(JSON.stringify(result)));
        log += JSON.stringify(result);
        dataTab.forEach((v) => {
            dataTabs += wrapHtmlData(v);
        });

        res.render('pages/index', {
            categories: createCategoriesMenuDiv(category),
            dataTabs: dataTabs,
            log: log,
        });
    });
});

function wrapHtmlData(dataTab){
    let dataTabTitle = dataTabTitles.getTitleById(dataTab['id']);
    return `<div class="dataTab" style="${dataTab['height'] ? 'height: ' + dataTab['height'] +'px; ' : ''} `
        + `${dataTab['width'] ? 'width: ' + dataTab['width'] + 'px; ': ''}"><div class="dataTabTitle">${dataTabTitle}</div>${dataTab['html_data']}</div>`;
}

const categories = ["FOOTBALL",
    "WAR",
    "UKRAINE",
    "WEATHER",
    "NEWS",
    "MUSIC",
    "FINANCE"];
//
// function getCategories(cb) {
//     const sql = "SELECT category FROM data_tab";
//     db.connection.query(sql, [], function (err, result) {
//         if (err) {
//             throw err;
//         }
//         console.log( Object.values(JSON.parse(JSON.stringify(result)))['category']);
//
//         cb( result);
//     });
// }

function createCategoriesMenuDiv(activeCategory) {
    return categories
    .map(c => createCategoryLink(c, activeCategory === c.toLowerCase()))
    .join('');
}

function createCategoryLink(category, isActive) {
    return `<a href="?category=${category.toLowerCase()}" ${isActive ? 'class="active"' : ''}>`
        + `${capitalizeFirstLetter(category.toLowerCase())}</a>\n`;
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// app.get('/app/login', (req, res) => {
//     res.render('pages/login', {
//         categories: createCategoriesMenuDiv('war')
//     });
// });

// app.post("/app/login", (req, res) => {
//     // const { username, password } = req.body
//
//     // db.query() code goes here
// })

// app.get('/app/123', (req, res) => {
//     res.statusCode = 200;
//     res.setHeader('Content-Type', 'text/plain');
//     res.end('Hello World');
// });
