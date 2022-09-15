const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Create Schema
const PlayerSchema = new mongoose.Schema({
    first_name: String,
    last_name: String,
    team: String,
    number: Number,
    position: String,
    age: Number | String,
    height: String,
    weight: String,
    college: String,
    salary: String,
    headshot: String,
    stats: {
        pts: Number,
        reb: Number,
        ast: Number,
        per: Number
    }
})

module.exports = Player = mongoose.model('player', PlayerSchema);