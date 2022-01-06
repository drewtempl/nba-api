const express = require('express');
const path = require('path');
const pug = require('pug');
const scraper = require('./scraper.js');
const file = require('./teams.json')
const fs = require('fs');


const app = express();
const router = express.Router();
const port = 3000;

app.set('views', './views');
app.set('view engine', 'pug');
app.use(scraper);

let allowCrossDomain = function(req, res, next) {
  res.header('Access-Control-Allow-Origin', "*");
  res.header('Access-Control-Allow-Headers', "*");
  next();
}
app.use(allowCrossDomain);

app.get('/', function (req, res) {
  //res.sendFile(path.join(__dirname, 'public', 'index.html'));
  //res.sendFile(path.join(__dirname, '/', 'teams.json'));
})

app.get('/api/teams', function(req, res) {
  res.json(file);
})

app.listen(port, function () {
  console.log(`Example app listening on port ${port}!`)
});

