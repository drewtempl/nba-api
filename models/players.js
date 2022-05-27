const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Create Schema
const PlayerSchema = new mongoose.Schema({
    first_name: String,
    last_name: String,
    team: String,
    number: Number,
    position: String,
    college: String,
    salary: String,
    headshot: String
})

module.exports = Player = mongoose.model('player', PlayerSchema);