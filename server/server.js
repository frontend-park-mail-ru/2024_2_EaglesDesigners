"use strict";
const express = require('express');
const app = express();
const port = 3000;
const fs = require('fs');
var http = require('http');
const path = require('path');

app.use(express.static('public'))

app.get('/', (req, res) => {
    const file = fs.readFile('./public/index.html', (err, data) => {

        if (err) {
            throw err;
        }
        res.write(data);
        res.end;
    });
    res.send();
});

const dirname = path.resolve();

app.use('/', express.static(path.resolve(dirname,'./')));

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});

console.log("LISTENING 3000");

