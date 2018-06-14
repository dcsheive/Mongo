var mongoose = require('mongoose');
const bcrypt = require('bcrypt');
var Schema = mongoose.Schema;
var UserSchema =  new mongoose.Schema({
    email: {
        type: String, 
        required: [true,'Email is required.'],
        validate: {
            validator:function(value){
                return /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/.test(value);
            },
            message: "Must be a valid email."
        }
    },
    first_name:  { 
        type: String, 
        required: [true, "First name is required."], 
        minlength: [2, "First name must be at least 2 characters."]
    },
    last_name: { type: String, 
        required: [true, "Last name is required."], 
        minlength: [2, "Last name must be at least 2 characters."] 
    },
    birthday: { type: Date },
    password: { 
        type: String, 
        required: [true, "Password is required."],
        minlength: [8, "Password must be 8 characters."]
    },
    password_confirm: {
        type: String,
        required: [true, "Please confirm your password."],
        validate: {
            validator:function(value){
                return value == this.password
            },
            message: "Passwords don't match."
        }
    },
    comments:[{ type: Schema.Types.ObjectId, ref: 'Comment'}],
    secrets:[{ type: Schema.Types.ObjectId, ref: 'Secret'}],

}, {timestamps: true })
UserSchema.pre('save', function(done){
    bcrypt.hash(this.password, 10)
    .then(hashed_password => {
        this.password = hashed_password
        this.password_confirm = null
        done()
    })
    .catch(error => {
        console.log("We have an error!", error);
    });
})
let User = mongoose.model("User",UserSchema)
module.exports = User