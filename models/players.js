const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Create Schema
const PlayerSchema = new mongoose.Schema({
    first_name: String,
    last_name: String,
    team: String
})

module.exports = Player = mongoose.model('player', PlayerSchema);