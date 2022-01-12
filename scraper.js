const cheerio = require('cheerio');
const request = require('request');
const mongoose = require('mongoose');
const fs = require('fs');
const writeStream = fs.createWriteStream('stats.csv');
const team = "okc"
const teams = [];

async function connectDB() {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017');
        
    } catch (error) {
        console.log(error);
    }
}

connectDB();


const getTeams = function (req, res, next) {

    request('https://www.espn.com/nba/teams', async function (error, response, html) {
        if (!error && response.statusCode == 200) {
            const $ = cheerio.load(html);
            const teams = [];

            $('.mt4 .ContentList__Item').each((i, el) => {
                let name = $(el).find('h2').text();
                let abbrev = $(el).find('.AnchorLink:first').attr('href');

                let array = abbrev.split('/');
                abbrev = array[5];

                let logo = `https://a.espncdn.com/combiner/i?img=/i/teamlogos/nba/500/${abbrev}.png`;

                teams.push({ team: `${name}`, abbrev: `${abbrev}`, logo: `${logo}` });
            });

            // try {
            //     await mongoose.connect('mongodb://127.0.0.1:27017');
            //     console.log(mongoose.connection);
            // } catch (error) {
            //     console.log(error);
            // }



            //exports.teams = teams;

            fs.writeFile("teams.json", JSON.stringify(teams), err => {
                if (err) {
                    console.error(err);
                    return;
                }
                console.log("Successfully written team data to file");

            });


        }
    });

    next();
}

let getPlayers = function (req, res, next) {
    request(`https://www.espn.com/nba/team/roster/_/name/${req.params.teamID}`, (error, response, html) => {
        if (!error && response.statusCode == 200) {
            const $ = cheerio.load(html);
            let players = [];

            // const firstPlayer = $('.Table__TBODY');
            // const output = firstPlayer.find('a').text();
            //writeStream.write(`${team}\n`);
            //writeStream.write('First Name, Last Name \n');



            $('.Table__TD--headshot .AnchorLink').each((i, el) => {
                const link = $(el).attr('href');

                //console.log(link);
                request(`${link}`, async function (error, response, html) {
                    if (!error && response.statusCode == 200) {
                        const $$ = cheerio.load(html);

                        const name = $$('.PlayerHeader__Name');
                        const firstName = name.find('span:first').text();
                        const lastName = name.find('span').next().text();

                        players.push({ first_name: `${firstName}`, last_name: `${lastName}` });

                        let insert = new playerModel({ first_name: `${firstName}`, last_name: `${lastName}` });
                        await insert.save();
                        console.log(insert.first_name);


                        //console.log(req.params.file)
                        //writeStream.write(`${firstName}, ${lastName} \n`);
                        /* fs.writeFileSync("players.json", JSON.stringify(players), err => {
                            if (err) {
                                console.error(err);
                                return;
                            }
                            console.log("Successfully written player data to file");
            
                        }); */
                        //console.log(players)
                        //resolve(true);
                        //res.json(players)
                        //console.log(firstName, lastName);
                        //return players;

                    }

                });
                //console.log(players)
            })
            //console.log(players);
            //return players;



            // fs.writeFileSync("players.json", JSON.stringify(players));
            // console.log(players)
            // resolve(true);
        }
        //console.log(players)

        // fs.writeFileSync("players.json", JSON.stringify(req.params.file));
        // res.json(req.params.file)
        // console.log(req.params.file)
        // console.log("PLAYER DATA");
        return playerModel.find();
    })

}

const playerSchema = new mongoose.Schema({
    first_name: String,
    last_name: String,
})

const playerModel = mongoose.model('Players', playerSchema);

//console.log(playerModel.find());

exports.playerModel = playerModel;


exports.getTeams = getTeams;
exports.getPlayers = getPlayers;