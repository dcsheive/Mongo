var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Secret = mongoose.model('Secret', new mongoose.Schema({
    text: { type: String, required: true, maxlength: 200, minlength:1 },
    comments:[{ type: Schema.Types.ObjectId, ref: 'Comment'}],
    user:{ type: Schema.Types.ObjectId, ref: 'User'}
}, {timestamps: true }))
module.exports = Secret