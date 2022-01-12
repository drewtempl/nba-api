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
//app.use(scraper.getPlayers);

console.log(scraper.playerModel.find())

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
  scraper.getPlayers(req, res, function(err, players) {
    if (err) {
      throw err;
    } 
    console.log(players);
    res.json(players);
  })

  // let playerData = await scraper.getPlayers(req, res);
  // console.log(playerData + 'playerData')
  // let file = fs.readFileSync('./players.json', 'utf-8')
  //await fetch('players.json');
  // try {
  //   file = 
  // } catch (err) {
  //   console.log(err);
  // }
  //console.log(file)
  
  //res.json(req.params.file)
  //next();
});
// //async function getList() {


//res.sendFile('players.json');


//let players =  JSON.parse(playersFile)



//console.log(players)
//res.json(players);


//let list = getList();
//console.log(playersFile);
//res.json(list);
//getList();




//console.log('File data:', jsonString) 





app.listen(port, function () {
  console.log(`Example app listening on port ${port}!`)
});

