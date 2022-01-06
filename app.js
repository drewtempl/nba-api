const express = require('express');
const path = require('path');
const pug = require('pug');
const scraper = require('./scraper.js');
const teamFile = require('./teams.json')
const fs = require('fs');


const app = express();
const router = express.Router();
const port = 3000;

app.set('views', './views');
app.set('view engine', 'pug');
app.use(scraper.getTeams);

let allowCrossDomain = function (req, res, next) {
  res.header('Access-Control-Allow-Origin', "*");
  res.header('Access-Control-Allow-Headers', "*");
  next();
}
app.use(allowCrossDomain);

app.get('/', function (req, res) {
  //res.sendFile(path.join(__dirname, 'public', 'index.html'));
  //res.sendFile
})

app.get('/api/teams', function (req, res) {
  res.json(teamFile);
})

app.get('/api/teams/:teamID', function (req, res) {

  async function getList() {
    await scraper.getPlayers(req, res);

    res.sendFile('players.json');

    let playersFile = await fs.readFileSync('./players.json')
    let players = await JSON.parse(playersFile)

    return players;

    //console.log(players)
    //res.json(players);
  }

  let list = getList();
  console.log(list);
  res.json(list);
  //getList();




  //console.log('File data:', jsonString) 
});




app.listen(port, function () {
  console.log(`Example app listening on port ${port}!`)
});

