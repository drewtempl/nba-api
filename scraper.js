const cheerio = require('cheerio');
const request = require('request');
const mongoose = require('mongoose');
const Team = require('./models/teams.js');
const Player = require('./models/players.js');
const db = require('./config/keys').mongoURI;

const getTeams = async function () {
    return new Promise((resolve, reject) => {

        const teams = [];
        console.log("scraping teams...")

        request('https://www.espn.com/nba/teams', function (error, response, html) {
            if (!error && response.statusCode == 200) {
                const $ = cheerio.load(html);
                

                $('.mt4 .ContentList__Item').each((i, el) => {
                    let name = $(el).find('h2').text();
                    let abbrev = $(el).find('.AnchorLink:first').attr('href');

                    let array = abbrev.split('/');
                    abbrev = array[5];

                    let logoURL = `https://a.espncdn.com/combiner/i?img=/i/teamlogos/nba/500/${abbrev}.png`;

                    let team = new Team({
                        name: `${name}`,
                        abvr: `${abbrev}`,
                        logo: `${logoURL}`
                    });

                    team.save();
                });
            }
            resolve();
        });
    })
}

let getPlayers = function (teamID) {
    return new Promise((resolve, reject) => {
        request(`https://www.espn.com/nba/team/roster/_/name/${teamID}`, (error, response, html) => {
            if (!error && response.statusCode == 200) {
                const $ = cheerio.load(html);

                $('.Table__TD--headshot .AnchorLink').each((i, el) => {
                    let link = $(el).attr('href');

                    let imgLink = $(el).find('img').attr('alt');
                    // console.log(imgLink)

                    request(`${link}`, function (error, response, html) {
                        if (!error && response.statusCode == 200) {
                            const $$ = cheerio.load(html);

                            const name = $$('.PlayerHeader__Name');
                            const firstName = name.find('span:first').text();
                            const lastName = name.find('span').next().text();

                            // console.log(firstName, lastName, teamID);

                            let player = new Player({
                                first_name: `${firstName}`,
                                last_name: `${lastName}`,
                                team: `${teamID}`,
                                position: " ",
                                headshot: `${imgLink}`
                            });
                            player.save();
                        }

                    });
                })

            }

        })
        resolve();
    })

}

async function init() {
    return new Promise(async function (resolve, reject) {
        console.log("Initializaing")
        await mongoose.connect(db);
        console.log('MongoDB Connected... (scraper)');

        // await Team.deleteMany();
        await Player.deleteMany();
        // await getTeams();
        const teamList = await Team.find();
        // console.log(teamList)

        teamList.forEach(async obj => {
            // console.log(`Getting ${obj.abvr} players`)
            await getPlayers(obj.abvr);
        })

        await mongoose.disconnect();
        console.log('MongoDB disconnected... (scraper)');

        resolve();
    })
}

module.exports = init;
