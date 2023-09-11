const hostname = '127.0.0.1';
const port = 3000;

const http = require('http');
const path = require('path');
// const fs = require('fs');

const express = require('express');
const app = express();

const db = require('./db.js');
const dataTabTitles = require('./dataTab.js');
const bodyParser = require("body-parser");

app.use(express.static(path.join(__dirname, '../../public')));
app.set('views', path.join(__dirname, '/../../public/views/'));
app.set('view engine', 'ejs');

const session = require('express-session');
app.use(
    session({
        secret: 'push_and_kril_55583',
        saveUninitialized: true,
        resave: true
    })
);

app.use(express.json());

app.use("/app/auth", require("./auth/route"))
app.use("/app/profile", require("./profile"))

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

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
    const sql = `SELECT id, name, html_data, height, width, category
                 FROM data_tab
                 where category = ${categorySelect}`;

    db.connection.query(sql, [category], function (err, result) {
        if (err) {
            throw err;
        }

        let tabs = Object.values(JSON.parse(JSON.stringify(result)));
        let activeId = tabId ? tabId : tabs[0]['id'];

        let activeTab = tabs.filter(d => d['id'] == activeId)[0];
        res.render('pages/index', {
            categories: createCategoriesMenuDiv(activeTab['category']),
            tabsMenu: createTabsMenuDiv(tabs, activeId),
            dataTabs: wrapHtmlData(activeTab),
            username: req.session.username
        });
    });
});

function wrapHtmlData(dataTab) {
    if (dataTab) {
        let name = dataTabTitles.getTitleById(dataTab['id']);
        if (!name) {
            name = dataTab['name'];
        }
        return `<div class="dataTab" style="${dataTab['height'] ? 'height: '
                + dataTab['height'] + 'px; ' : ''} `
            + `${dataTab['width'] ? 'width: ' + dataTab['width'] + 'px; '
                : ''}">`
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
    "FINANCE",
    "KIDS"];
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
    return "<ul>" + categories
    .map(c => createCategoryLink(c.toLowerCase(),
        activeCategory === c))
    .join('') + "</ul>";
}

function createTabLink(id, tabName, isActive) {
    let name = dataTabTitles.getTitleById(id);
    if (!name) {
        name = tabName;
    }
    return `<a href="?tabId=${id}" ${isActive ? 'class="active"'
        : ''}>${name}</a></li>\n`;
}

function createCategoryLink(category, isActive) {
    return `<li ${isActive ? 'class="active"' : ''}>`
        + `<a href="?category=${category}">${capitalizeFirstLetter(category)}</a></li>\n`;
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// app.get('/app/test', (req, res) => {
//     let test = "<div class='myTestDiv' >HELLO</div>";
//     res.render('pages/test', {
//         test: test
//     });
// });
