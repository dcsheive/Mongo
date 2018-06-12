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
var Schema = mongoose.Schema;
mongoose.connect('mongodb://localhost/messages');
var CommentSchema = new mongoose.Schema({
    name:  { type: String, required: true, minlength: 3},
    text: { type: String, required: true, maxlength: 200, minlength:1 },
    message:{ type: Schema.Types.ObjectId, ref: 'Message'}

}, {timestamps: true });
var MessageSchema = new mongoose.Schema({
    name:  { type: String, required: true, minlength: 3},
    text: { type: String, required: true, maxlength: 200, minlength:1 },
    comments:[{ type: Schema.Types.ObjectId, ref: 'Comment'}]
}, {timestamps: true });
mongoose.Promise = global.Promise;

mongoose.model('Message', MessageSchema); // We are setting this Schema in our Models as 'User'
mongoose.model('Comment', CommentSchema); // We are setting this Schema in our Models as 'User'
var Message = mongoose.model('Message') // We are retrieving this Schema from our Models, named 'User'
var Comment = mongoose.model('Comment') // We are retrieving this Schema from our Models, named 'User'

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
    Message.find({}).populate('comments').exec(function(err, messages){
        if (err){
            console.log("We have an error!", err);
        }
        else{
            return res.render('index', {messages:messages})
        }
    })

})
// Add User Request 
app.post('/message', function (req, res){
    var message = new Message(req.body);
    message.save(function(err){
        if(err){
            // if there is an error upon saving, use console.log to see what is in the err object 
            console.log("We have an error!", err);
            // adjust the code below as needed to create a flash message with the tag and content you would like
            for(var key in err.errors){
                req.flash('message', err.errors[key].message);
            }
            // redirect the user to an appropriate route
            res.redirect('/');
        }
        else {
            res.redirect('/');
        }
    });
});
app.post('/comment', function (req, res){
    var comment = new Comment(req.body);
    comment.save(function(err){
        if(err){
            // if there is an error upon saving, use console.log to see what is in the err object 
            console.log("We have an error!", err);
            // adjust the code below as needed to create a flash message with the tag and content you would like
            for(var key in err.errors){
                req.flash('comment', err.errors[key].message);
            }
            // redirect the user to an appropriate route
            res.redirect('/');
        }
        else {
            Message.findById(comment.message, function(err,message){
                if (err){
                    console.log("We have an error!", err);
                }
                else {
                    message.comments.push(comment.id)
                    message.save(function(err){
                        if (err){
                            console.log("We have an error!", err);
                        }
                        else {
                            res.redirect('/')
                        }
                    
                    })
                }
            })
        }
    })
});
// Setting our Server to Listen on Port: 8000
app.listen(8000, function() {
    console.log("listening on port 8000");
})
