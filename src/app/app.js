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

app.get("/", (req, res) => {
    let dataTabs = "";

    const category = req.query.category || 'war';
    const sql = "SELECT html_data, height, width FROM data_tab where category = ?";

    db.connection.query(sql, [category], function (err, result) {
        if (err) {
            throw err;
        }

        let dataTab = Object.values(JSON.parse(JSON.stringify(result)));

        dataTab.forEach((v) => {
            // dataTabs += wrapHtmlData(v);
            dataTabs += v['html_data'];
        });

        res.render('pages/index.ejs', {
            categories: createCategoriesMenuDiv(category),
            dataTabs: dataTabs
        });
    });
});

function wrapHtmlData(dataTab){
    return `<div ${dataTab['height'] ? 'height = "' + dataTab['height'] + '"': ''} `
        + `${dataTab['width'] ? 'width = "' + dataTab['width'] + '"': ''}>${dataTab['html_data']}</div>`
}

const categories = ["FOOTBALL",
    "WAR",
    "UKRAINE",
    "HISTORY",
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

// app.get('/app/123', (req, res) => {
//     res.statusCode = 200;
//     res.setHeader('Content-Type', 'text/plain');
//     res.end('Hello World');
// });
