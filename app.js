const express = require('express');
const path = require('path');
const scraper = require('./scraper.js');


const app = express();
const router = express.Router();
const port = 3000;


//console.log(scraper.playerModel.find())

let allowCrossDomain = function (req, res, next) {
  res.header('Access-Control-Allow-Origin', "*");
  res.header('Access-Control-Allow-Headers', "*");
  next();
}
app.use(allowCrossDomain);

app.get('/api/teams', function (req, res) {
  
  res.json(teamFile);
})

app.get('/api/teams/:teamID', function (req, res) {
  scraper.getPlayers(req, res, function(err, players) {
    if (err) {
      throw err;
    } 
    console.log(players);
    res.json(players);
  })
});

app.listen(port, function () {
  console.log(`Example app listening on port ${port}!`)
});

