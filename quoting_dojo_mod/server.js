var express = require('express');
var app = express();
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
mongoose.connect('mongodb://localhost/quotes');
var QuoteSchema = new mongoose.Schema({
    name:  { type: String, required: true, minlength: 3},
    quote: { type: String, required: true, maxlength: 200 },
    created_at: {type:Date, default: Date.now}
}, {timestamps: true });
mongoose.Promise = global.Promise;

mongoose.model('Quote', QuoteSchema); // We are setting this Schema in our Models as 'User'
var Quote = mongoose.model('Quote') // We are retrieving this Schema from our Models, named 'User'

var path = require('path');
app.use(express.static(path.join(__dirname, './static')));
app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');

require('./server/config/routes.js')(app);

app.listen(8000, function() {
    console.log("listening on port 8000");
})