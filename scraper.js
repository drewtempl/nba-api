const cheerio = require('cheerio');
const request = require('request');
const Team = require('./models/teams.js');

const playerSchema = new mongoose.Schema({
    first_name: String,
    last_name: String,
})



function getTeams() {

    request('https://www.espn.com/nba/teams', function (error, response, html) {
        if (!error && response.statusCode == 200) {
            const $ = cheerio.load(html);

            $('.mt4 .ContentList__Item').each((i, el) => {
                let name = $(el).find('h2').text();
                let abbrev = $(el).find('.AnchorLink:first').attr('href');

                let array = abbrev.split('/');
                abbrev = array[5];

                let logo = `https://a.espncdn.com/combiner/i?img=/i/teamlogos/nba/500/${abbrev}.png`;

                let team = new Team({
                    team: `${name}`,
                    abbrev: `${abbrev}`,
                    logo: `${logo}`
                });
                
                console.log(team.name)

                team.save();
            });
        }
    });
}

exports.init = init;
exports.getTeams = getTeams;




async function init() {
    getTeams();     
}


