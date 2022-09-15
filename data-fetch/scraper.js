const cheerio = require("cheerio");
const request = require("request");
const mongoose = require("mongoose");
const Team = require("../models/teams.js");
const Player = require("../models/players.js");
const db = require("../config/keys").mongoURI;
const parser = require("./parser");
const getTeams = require("./getTeams");

let getPlayers = function (teamList) {
  return new Promise((resolve, reject) => {
    teamList.forEach((obj) => {
      request(
        `https://www.espn.com/nba/team/roster/_/name/${obj.abvr}`,
        (error, response, html) => {
          if (!error && response.statusCode == 200) {
            const $ = cheerio.load(html);
            const playerInfoArr = [];

            $(".Table__TBODY tr").each((i, el) => {
              const playerInfo = [];
              $(el).find("td").each(function(i, elem){
                let str = $(elem).text();
                if (i == 1) {
                  const parsed = parser(str);
                  playerInfo.push(parsed[0]);
                  playerInfo.push(parsed[1]);
                  playerInfo.push(parsed[2]);

                }
                else if (i > 1) {
                  playerInfo.push(str);
                }
                
              });
              playerInfoArr.push(playerInfo);
            });

            $(".Table__TD--headshot .AnchorLink").each((i, el) => {
              let link = $(el).attr("href");
              let imgLink = $(el).find("img").attr("alt");

              request(`${link}`, function (error, response, html) {
                if (!error && response.statusCode == 200) {
                  const $$ = cheerio.load(html);

                  const name = $$(".PlayerHeader__Name");
                  let firstName = name.find("span:first").text();
                  let lastName = name.find("span").next().text();

                  const playerStats = [];
                  $$(".PlayerHeader__Right .StatBlock__Content .StatBlockInner__Value").each(function(i, elem){
                    let str = $$(elem).text();
                    playerStats.push(str);
                  });

                  const playerObj = playerInfoArr.find((element) => {
                    return (
                      element[0] === firstName && 
                      element[1] === lastName
                    );
                  });

                  const player = new Player({
                    first_name: firstName,
                    last_name: lastName,
                    team: obj.abvr,
                    number: playerObj[2],
                    position: playerObj[3],
                    age: playerObj[4],
                    height: playerObj[5],
                    weight: playerObj[6],
                    college: playerObj[7],
                    salary: playerObj[8],
                    headshot: imgLink,
                    stats: {
                      pts: playerStats[0],
                      reb: playerStats[1],
                      ast: playerStats[2],
                      per: playerStats[3]
                    }
                  });
                  console.log(player);

                  player.save();
                }
              });
            });
          }
        }
      );
    });
    resolve();
  });
};

async function init() {
  return new Promise(async function (resolve, reject) {
    await mongoose.connect(db);
    console.log("MongoDB Connected... (scraper)");

    // await Team.deleteMany();
    await Player.deleteMany();
    // await getTeams();
    const teamList = await Team.find();
    // console.log(teamList)

    await getPlayers(teamList);

    await mongoose.disconnect();
    console.log('MongoDB disconnected... (scraper)');

    resolve();
  });
}

module.exports = init;
