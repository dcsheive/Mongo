const mongoose = require('mongoose');
var Quote = mongoose.model('Quote',new mongoose.Schema({
    name:  { type: String, required: true, minlength: 3},
    quote: { type: String, required: true, maxlength: 200 },
    created_at: {type:Date, default: Date.now}
}, {timestamps: true }))
module.exports = Quote
