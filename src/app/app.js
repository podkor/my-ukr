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

app.get("/", (req, res) => {
    res.redirect("/app");
});

app.get("/app", (req, res) => {
    let tabId = req.query.tabId

    const category = req.query.category || 'war';
    let categorySelect = tabId ? "(select category from data_tab where id="
        + tabId + ")" : `"${category}"`;
    const sql = `SELECT id, name, html_data, height, width
                 FROM data_tab
                 where category = ${categorySelect}`;

    db.connection.query(sql, [category], function (err, result) {
        if (err) {
            throw err;
        }

        let tabs = Object.values(JSON.parse(JSON.stringify(result)));
        let activeId = tabId ? tabId : tabs[0]['id'];

        let activeTab = tabs.filter(d => d['id'] == activeId);

        res.render('pages/index', {
            categories: createCategoriesMenuDiv(category),
            tabsMenu: createTabsMenuDiv(tabs, activeId),
            dataTabs: wrapHtmlData(activeTab)
        });
    });
});

function wrapHtmlData(dataTabs) {
    if (dataTabs[0]) {
        let dataTab = dataTabs[0];
        let name = dataTabTitles.getTitleById(dataTab['id']);
        if (!name) {
            name = dataTab['name'];
        }
        return `<div class="dataTab" style="${dataTab['height'] ? 'height: '
                + dataTab['height'] + 'px; ' : ''} `
            + `${dataTab['width'] ? 'width: ' + dataTab['width'] + 'px; ' : ''}">`
            + `<div class="dataTabHead">${name}</div>`
            + `<div class="dataTabBody">${dataTab['html_data']}</div></div>`;
    } else {
        return ""
    }
}

const categories = ["WAR",
    "FOOTBALL",
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

function createTabsMenuDiv(tabs, activeTabId) {
    return tabs
    .map(t => createTabLink(t['id'], t['name'],
        t['id'] == activeTabId))
    .join('');
}

function createCategoriesMenuDiv(activeCategory) {
    return categories
    .map(c => createCategoryLink(c.toLowerCase(),
        activeCategory === c.toLowerCase()))
    .join('');
}

function createTabLink(id, tabName, isActive) {
    let name = dataTabTitles.getTitleById(id);
    if (!name) {
        name = tabName;
    }
    return `<a href="?tabId=${id}" ${isActive ? 'class="active"'
        : ''}>${name}</a>\n`;
}

function createCategoryLink(category, isActive) {
    return `<a href="?category=${category}" ${isActive ? 'class="active"'
            : ''}>`
        + `${capitalizeFirstLetter(category)}</a>\n`;
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

app.get('/app/test', (req, res) => {
    let test = "<div class='myTestDiv' >HELLO</div>";
    res.render('pages/test', {
        test: test
    });
});
