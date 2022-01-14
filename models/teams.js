const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Create Schema
const TeamSchema = new mongoose.Schema({
    name: String,
    abvr: String,
    logo: String
})

module.exports = Team = mongoose.model('team', TeamSchema);