const cheerio = require('cheerio');
const request = require('request');
const mongoose = require('mongoose');

async function connectDB(callback) {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017');
        
    } catch (error) {
        console.log(error);
    }
}

connectDB(logger);

function logger() {
    console.log("hello");
}



const playerSchema = new mongoose.Schema({
    first_name: String,
    last_name: String,
})

const teamSchema = new mongoose.Schema({
    name: String,
    abbrev: String,
    logo: String
})

function getTeams() {

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
        }
    });
}


async function init() {
     
}