let mongoose = require('mongoose');

let ChatSchema = new mongoose.Schema({
    ChatMessage: String,
    PlayerName: String,
    PlayerSteamID: String,
    PlayerTeam: String,
    IsGlobal: Boolean,
    Time: { type : Date, default: Date.now }
});

module.exports = mongoose.model('ChatMessage', ChatSchema);