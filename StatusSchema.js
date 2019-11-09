let mongoose = require('mongoose');

let StatusSchema = new mongoose.Schema({
    TotalPopulation: Number,
    HumanPopulation: Number,
    ZombiePopulation: Number,
    SpectatorPopulation: Number,
    BotPopulation: Number,
    TotalConnects: Number,
    TotalDisconnects: Number,
    TotalZombieDeaths: Number,
    TotalHumanDeaths: Number,
    TotalPointsEarned: Number,
    TotalPointsSpent: Number,
    TotalWeaponsPurchased: Number,
    TotalAmmoPurchased: Number,
    TotalNailedProps: Number,
    TotalNailsUsed: Number,
    TotalHumanMessages: Number,
    TotalZombieMessages: Number,
    TotalGlobalMessages: Number,
    AverageWeaponTierInUse: Number,
    CurrentWave: Number,
    CurrentMap: String,
    Time: { type : Date, default: Date.now }
});

module.exports = mongoose.model('ServerStatus', StatusSchema);