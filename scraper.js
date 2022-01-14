const cheerio = require('cheerio');
const request = require('request');
const mongoose = require('mongoose');
const Team = require('./models/teams.js');
const { next } = require('cheerio/lib/api/traversing');

const playerSchema = new mongoose.Schema({
    first_name: String,
    last_name: String,
})



const getTeams = function() {
    console.log("scraping...")
    request('https://www.espn.com/nba/teams', function (error, response, html) {
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


            console.log(teams)
            //return teams;
        }
    });
    
}

function init() {
    getTeams();
    next();
}

init();


module.exports = init;