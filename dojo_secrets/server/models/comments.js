var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Comment = mongoose.model('Comment', new mongoose.Schema({
    text: { type: String, required: true, maxlength: 200, minlength:1 },
    secret:{ type: Schema.Types.ObjectId, ref: 'Secret'},
    user:{ type: Schema.Types.ObjectId, ref: 'User'}
}, {timestamps: true }))
module.exports = Comment