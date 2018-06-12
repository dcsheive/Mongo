var express = require('express');

var app = express();

const bcrypt = require('bcrypt');

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));

var session = require('express-session')
app.use(session({
    secret: 'codingmojo',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60000 }
}))

const flash = require('express-flash');
app.use(flash());

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/users');
var UserSchema = new mongoose.Schema({
    email: {
        type: String, 
        required: [true,'Email is required'],
        validate: {
            validator:function(value){
                return /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/.test(value);
            },
            message: "Must be a valid email"
        }
    },
    first_name:  { 
        type: String, 
        required: [true, "First name is required"], 
        minlength: [2, "First name must be at least 2 characters"]
    },
    last_name: { type: String, 
        required: [true, "Last name is required"], 
        minlength: [2, "Last name must be at least 2 characters"] 
    },
    birthday: { type: Date },
    password: { 
        type: String, 
        required: [true, "Password is required"],
        minlength: [8, "Password must be 8 characters"]
    },
    password_confirm: {
        type: String,
        required: [true, "Please confirm your password"],
        validate: {
            validator:function(value){
                return value == this.password
            },
            message: "Passwords don't match"
        }
    }

}, {timestamps: true });
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
mongoose.Promise = global.Promise;
mongoose.model('User', UserSchema);
var User = mongoose.model('User')
var path = require('path');
app.use(express.static(path.join(__dirname, './static')));
app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');

app.get('/', function(req, res) {
    return res.render('index', {session:req.session})
})

app.post('/register', function (req, res){
    req.session.first_name = req.body.first_name
    req.session.last_name = req.body.last_name
    req.session.email = req.body.email
    req.session.birthday = req.body.birthday
    User.find({email: req.body.email}, function(err,user){
        if(user.length>0){
            req.flash('email', "Email taken!");
            res.redirect('/');
        }
        else{
            var user = new User(req.body);
            user.save(function(err){
                if(err){
                    for(var key in err.errors){
                        console.log(key)
                        req.flash(key, err.errors[key].message);
                    }
                    res.redirect('/');
                }
                else {
                    req.session.first_name = user.first_name
                    req.session.user_id = user.id
                    res.redirect('/home');
                }
            });
        }
    })
});

app.post('/login', function(req,res){
    User.find({email: req.body.email}, function(err,user){
        if(err){
            console.log("We have an error!", err);
            res.redirect('/');
        }
        else {
            if(user.length>0){
                bcrypt.compare(req.body.password, user[0].password)
                    .then( result => {
                        if (result){
                            req.session.first_name = user[0].first_name
                            req.session.user_id = user[0].id
                            res.redirect('/home');
                        }
                        else {
                            req.flash('login', 'Login information was incorrect!')
                            res.redirect('/')
                        }
                    })
                    .catch( error => {
                        console.log("We have an error!", error);
                    })
            }
            else {
                req.flash('login', 'Please Register!')
                res.redirect('/');
            }

        }
    })
})

app.get('/home',function(req,res){
    if (!req.session.user_id){
        return res.redirect('/')
    }
    return res.render('home',{user:req.session})
})
app.get('/logout',function(req,res){
    req.session.destroy()
    return res.redirect('/')
})

app.listen(8000, function() {
    console.log("listening on port 8000");
})
