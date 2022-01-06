const cheerio = require('cheerio');
const request = require('request');
const fs = require('fs');
const writeStream = fs.createWriteStream('stats.csv');
const team = "okc"
const teams = [];

/*  function getTeams() {


     request('https://www.espn.com/nba/teams', (error, response, html) => {
        if (!error && response.statusCode == 200) {
            const $ = cheerio.load(html);

            $('.mt4 .ContentList__Item').each((i, el) => {
                let name = $(el).find('h2').text();
                let abbrev = $(el).find('.AnchorLink:first').attr('href');

                let array = abbrev.split('/');
                abbrev = array[5];

                let logo = `https://a.espncdn.com/combiner/i?img=/i/teamlogos/nba/500/${abbrev}.png`;

                teams.push({ team: `${name}`, abbrev: `${abbrev}`, logo: `${logo}`})
            })
            const teamsJSON = JSON.stringify(teams);
            return teamsJSON;
        }
    });
} */

const getTeams = function (req, res, next) {

    request('https://www.espn.com/nba/teams', (error, response, html) => {
        if (!error && response.statusCode == 200) {
            const $ = cheerio.load(html);
            const teams = [];

            $('.mt4 .ContentList__Item').each((i, el) => {
                let name = $(el).find('h2').text();
                let abbrev = $(el).find('.AnchorLink:first').attr('href');

                let array = abbrev.split('/');
                abbrev = array[5];

                let logo = `https://a.espncdn.com/combiner/i?img=/i/teamlogos/nba/500/${abbrev}.png`;

                teams.push({ team: `${name}`, abbrev: `${abbrev}`, logo: `${logo}` })
            })

            //exports.teams = teams;

            fs.writeFile("teams.json", JSON.stringify(teams), err => {
                if (err) {
                    console.error(err);
                    return;
                }
                console.log("Successfully written data to file");

            });

            next();
        }
    });
}

let getPlayers = function(req, res, next)  {
    request(`https://www.espn.com/nba/team/roster/_/name/${req.params.teamID}`, (error, response, html) => {
        if (!error && response.statusCode == 200) {
            const $ = cheerio.load(html);
            const players = []

            // const firstPlayer = $('.Table__TBODY');
            // const output = firstPlayer.find('a').text();
            //writeStream.write(`${team}\n`);
            //writeStream.write('First Name, Last Name \n');

            $('.Table__TD--headshot .AnchorLink').each((i, el) => {
                const link = $(el).attr('href');

                //console.log(link);

                request(`${link}`, (error, response, html) => {
                    if (!error && response.statusCode == 200) {
                        const $$ = cheerio.load(html);

                        const name = $$('.PlayerHeader__Name');
                        const firstName = name.find('span:first').text();
                        const lastName = name.find('span').next().text();

                        players.push({first_name: `${firstName}`, last_name: `${lastName}`})

                        //writeStream.write(`${firstName}, ${lastName} \n`);

                        fs.writeFile("players.json", JSON.stringify(players), err => {
                            if (err) {
                                console.error(err);
                                return;
                            }
                            //console.log("Successfully written data to file");
            
                        });
                        

                        console.log(firstName, lastName);
                    }

                });


            })
        }

        //next()
    })

    
}

exports.getTeams = getTeams;
exports.getPlayers = getPlayers;