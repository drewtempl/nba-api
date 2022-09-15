const express = require('express');
const path = require('path');
const scraper = require('./data-fetch/scraper.js');
const mongoose = require('mongoose');
const Team = require('./models/teams.js');
const Player = require('./models/players.js');
const db = require('./config/keys').mongoURI;

const app = express();
const router = express.Router();
const port = 3000;

const allowCrossDomain = function (req, res, next) {
  res.header('Access-Control-Allow-Origin', "*");
  res.header('Access-Control-Allow-Headers', "*");
  next();
}
app.use(allowCrossDomain);

async function startup () {
  // await scraper();
  await mongoose.connect(db);
  console.log('MongoDB Connected... (app)');
}

startup();

//Get request for list of teams
app.get('/api/teams', async function (req, res) {
  const teamList = await Team.find();
  res.json(teamList);
})

//Get request for list of players on specified team
app.get('/api/teams/:teamID', async function (req, res) {
  const playerList = await Player.find({ team: `${req.params.teamID}`});
  res.json(playerList);
});

app.listen(port, function () {
  console.log(`Example app listening on port ${port}!`)
});



