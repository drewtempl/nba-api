const cheerio = require("cheerio");
const request = require("request");
const mongoose = require("mongoose");
const Team = require("./models/teams.js");
const Player = require("./models/players.js");
const db = require("./config/keys").mongoURI;
const parser = require("./parser");

const getTeams = async function () {
  return new Promise((resolve, reject) => {
    const teams = [];
    console.log("scraping teams...");

    request("https://www.espn.com/nba/teams", function (error, response, html) {
      if (!error && response.statusCode == 200) {
        const $ = cheerio.load(html);

        $(".mt4 .ContentList__Item").each((i, el) => {
          let name = $(el).find("h2").text();
          let abbrev = $(el).find(".AnchorLink:first").attr("href");

          let array = abbrev.split("/");
          abbrev = array[5];

          let logoURL = `https://a.espncdn.com/combiner/i?img=/i/teamlogos/nba/500/${abbrev}.png`;

          let team = new Team({
            name: `${name}`,
            abvr: `${abbrev}`,
            logo: `${logoURL}`,
          });

          team.save();
        });
      }
      resolve();
    });
  });
};

let getPlayers = function (teamList) {
  return new Promise((resolve, reject) => {
    teamList.forEach((obj) => {
      request(
        `https://www.espn.com/nba/team/roster/_/name/${obj.abvr}`,
        (error, response, html) => {
          if (!error && response.statusCode == 200) {
            const $ = cheerio.load(html);
            const playerSalaries = [];
            let index = 0;
            // console.log(obj.abvr)
            $(".Table__TBODY tr").each((i, el) => {
              let str = $(el).find("td").text();
              const playerObj = parser(str);
              playerSalaries.push(playerObj);
            });

            $(".Table__TD--headshot .AnchorLink").each((i, el) => {
              let link = $(el).attr("href");
              let imgLink = $(el).find("img").attr("alt");
              // console.log(i)

              request(`${link}`, function (error, response, html) {
                if (!error && response.statusCode == 200) {
                  const $$ = cheerio.load(html);

                  const name = $$(".PlayerHeader__Name");
                  let firstName = name.find("span:first").text();
                  let lastName = name.find("span").next().text();
                  const playerObj = playerSalaries.find(element => {
                    return (element.firstName === firstName && element.lastName === lastName)
                  })
                  let sal = "";
                  let num = "";
                  let pos = "";
                  if (playerObj != undefined) {
                    sal = playerObj.salary;
                    num = playerObj.number;
                    pos = playerObj.position;
                  }

                  const player = new Player({
                    first_name: firstName,
                    last_name: lastName,
                    team: obj.abvr,
                    number: num,
                    position: pos,
                    salary: sal,
                    headshot: imgLink,
                  });

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

    // await mongoose.disconnect();
    // console.log('MongoDB disconnected... (scraper)');

    resolve();
  });
}

module.exports = init;
