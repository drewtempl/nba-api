const cheerio = require('cheerio');
const request = require('request');
const mongoose = require('mongoose');
const Team = require('./models/teams.js');

const playerSchema = new mongoose.Schema({
    first_name: String,
    last_name: String,
})

const db = require('./config/keys').mongoURI;


// mongoose
//   .connect(db)
//   .then(() => console.log('MongoDB Connected...'))
//   .catch(err => console.log(err))


const getTeams = async function () {
    return new Promise((resolve, reject) => {

        const teams = [];
        console.log("scraping...")

        request('https://www.espn.com/nba/teams', function (error, response, html) {
            if (!error && response.statusCode == 200) {
                const $ = cheerio.load(html);
                //const teams = [];

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

                    //teams.push({ team: `${name}`, abbrev: `${abbrev}`, logo: `${logo}` });


                });

                //console.log(teams)



            }

            resolve();

        });


    })
}

let getPlayers = function (req, res, next) {
    request(`https://www.espn.com/nba/team/roster/_/name/${req.params.teamID}`, (error, response, html) => {
        if (!error && response.statusCode == 200) {
            const $ = cheerio.load(html);
            let players = [];



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
                    }

                });
            })
            
        }
        
    })

}

async function init() {
    await mongoose.connect(db);
    console.log('MongoDB Connected...');

    await Team.deleteMany();
    await getTeams();

    const output = await Team.find();
    console.log(output);
}

init();

module.exports = init;