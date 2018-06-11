// Require the Express Module
var express = require('express');
// Create an Express App
var app = express();
// Require body-parser (to receive post data from clients)
var bodyParser = require('body-parser');

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
mongoose.connect('mongodb://localhost/owls');
var OwlSchema = new mongoose.Schema({
    name:  { type: String, required: true, minlength: 3},
    desc: { type: String, required: true, maxlength: 200 },
    age: {type: Number},
    created_at: {type:Date, default: Date.now}
}, {timestamps: true });
mongoose.Promise = global.Promise;

mongoose.model('Owl', OwlSchema); // We are setting this Schema in our Models as 'User'
var Owl = mongoose.model('Owl') // We are retrieving this Schema from our Models, named 'User'

// Integrate body-parser with our App
app.use(bodyParser.urlencoded({ extended: true }));
// Require path
var path = require('path');
// Setting our Static Folder Directory
app.use(express.static(path.join(__dirname, './static')));
// Setting our Views Folder Directory
app.set('views', path.join(__dirname, './views'));
// Setting our View Engine set to EJS
app.set('view engine', 'ejs');
// Routes
// Root Request
app.get('/', function(req, res) {
    Owl.find({}, function(err, owls) {
        if(err) {
            console.log('something went wrong');
        } 
        else { // else console.log that we did well and then redirect to the root route
            return res.render('index', {owls:owls})
        }
    })
})
// Add User Request
app.get('/owls/new',function(req,res){
    return res.render('newowls')
}) 
app.post('/owls', function (req, res){
    var owl = new Owl(req.body);
    owl.save(function(err){
        if(err){
            // if there is an error upon saving, use console.log to see what is in the err object 
            console.log("We have an error!", err);
            // adjust the code below as needed to create a flash message with the tag and content you would like
            for(var key in err.errors){
                req.flash('registration', err.errors[key].message);
            }
            // redirect the user to an appropriate route
            res.redirect('/');
        }
        else {
            res.redirect('/');
        }
    });
});
app.get('/owls/:id',function(req,res){
    Owl.findById( req.params.id, function(err,owl) {
        if(err) {
            console.log('something went wrong');
            return res.redirect('/')

        } 
        else { // else console.log that we did well and then redirect to the root route
            return res.render('owldetails', {owl:owl})
        }
    })
})
app.post('/owls/:id',function(req,res){
    Owl.findById(req.params.id, function(err, owl){
        owl.name = req.body.name
        owl.age = req.body.age
        owl.desc = req.body.desc
        owl.save(function(err){
            if(err) {
                console.log('something went wrong');
            } 
            else { // else console.log that we did well and then redirect to the root route
                return res.redirect('/owls/'+req.params.id)
            }
        })
    })
})
app.get('/owls/:id/edit',function(req,res){
    Owl.findById( req.params.id, function(err,owl) {
        if(err || owl == null) {
            console.log('something went wrong');
            return res.redirect('/')
        } 
        else { // else console.log that we did well and then redirect to the root route
            return res.render('owledit', {owl:owl})
        }
    })
})
app.post('/owls/:id/delete',function(req,res){
    Owl.findById(req.params.id, function(err, owl){
        owl.remove(function(err){
            if(err) {
                console.log('something went wrong');
            } 
            else { // else console.log that we did well and then redirect to the root route
                return res.redirect('/')
            }
        })
    })
})
// Setting our Server to Listen on Port: 8000
app.listen(8000, function() {
    console.log("listening on port 8000");
})
