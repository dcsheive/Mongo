var mongoose = require('mongoose');
var Owl = mongoose.model('Owl',new mongoose.Schema({
    name:  { type: String, required: true, minlength: 3},
    desc: { type: String, required: true, maxlength: 200 },
    age: {type: Number},
    created_at: {type:Date, default: Date.now}
}, {timestamps: true }))
module.exports = Owl