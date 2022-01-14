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

                    let logo = `https://a.espncdn.com/combiner/i?img=/i/teamlogos/nba/500/${abbrev}.png`;

                    let team = new Team({
                        team: `${name}`,
                        abrv: `${abbrev}`,
                        logo: `${logo}`
                    });

                    team.save();

                    teams.push({ team: `${name}`, abbrev: `${abbrev}`, logo: `${logo}` });


                });

                console.log(teams)



            }

            resolve();

        });


    })
}

async function init() {
    await mongoose.connect(db);
    console.log('MongoDB Connected...');
    
    await Team.deleteMany();
    await getTeams();
    
    const output = await Team.find();
    console.log(output);
    //console.log(teams)
}



module.exports = init();