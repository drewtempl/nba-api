const express = require('express');
const path = require('path');
const scraper = require('./scraper.js');
const mongoose = require('mongoose');
const Team = require('./models/teams.js');



const app = express();
const router = express.Router();
const port = 3000;

const db = require('./config/keys').mongoURI;

mongoose
  .connect(db)
  .then(() => console.log('MongoDB Connected...'))
  .catch(err => console.log(err))

const team1 = new Team({
  name: "Chicago Bulls",
  abbre: "chi",
  logo: "URL HERE"
})

team1.save()

app.use(scraper.getTeams(mongoose));

app.get('/test', function(req, res) {
  Team.find(team1).then(console.log(team1.name))
  res.send("Team Found");
});


app.get('/api/teams', function (req, res) {
  res.json(teamFile);
})

app.get('/api/teams/:teamID', function (req, res) {
  
});

app.listen(port, function () {
  console.log(`Example app listening on port ${port}!`)
});



