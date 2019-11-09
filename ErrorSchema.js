let mongoose = require('mongoose');

let ErrorSchema = new mongoose.Schema({
    ErrorMessage: String,
    ErrorType: String, // Can either be 'lua', or 'custom'
    Time: { type : Date, default: Date.now }
});

module.exports = mongoose.model('ServerError', ErrorSchema);