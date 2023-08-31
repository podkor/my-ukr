const http = require('http');
const path = require('path');

var express = require('express');
var fs = require('fs');
var index = fs.readFileSync('index.html');
var app = express();
app.use(express.static(path.join(__dirname, 'public')));

const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer(app)
.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});

app.get('/app', (req, res) => {
    if(req.url.indexOf('/app') != -1){ //req.url has the pathname, check if it conatins '.html'
        fs.readFile(__dirname + '/index.html', function (err, data) {
            if (err) console.log(err);
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.write(data);
            res.end();
        });
    }
});

app.get('/app/123', (req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Hello World');
});
