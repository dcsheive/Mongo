const express = require('express')

var app = express();

const bodyParser = require('body-parser')

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/messages');
var PeopleSchema = new mongoose.Schema({
    name:  { type: String, required: true, minlength: 3}
}, {timestamps: true });
mongoose.Promise = global.Promise;
mongoose.model('People', PeopleSchema);
var People = mongoose.model('People')

app.use(bodyParser.json());

app.get('/', function (req,res){
    People.find({}, function (err,people){
        if(err){
            console.log("Returned error", err);
            res.json({message: "Error", error: err})
         }
         else {
            res.json({people})
         }
    })
})
app.get('/new/:name/', function(req,res){
    let person = new People({name : req.params.name})
    person.save(function(err){
        if(err){
            res.redirect('/');
        }
        else {
            res.redirect('/'+req.params.name);
        }
    })
})

app.get('/remove/:name/', function(req,res){
    People.remove({name:req.params.name},function(err){
        if(err){
            res.redirect('/');
        }
        else {
            res.redirect('/');
        }
    })
})
app.get('/:name/', function(req,res){
    People.find({name:req.params.name}, function (err,people){
        if(err){
            console.log("Returned error", err);
            res.json({message: "Error", error: err})
         }
         else {
            res.json({people})
         }
    })
})

app.listen(8000, function() {
    console.log("listening on port 8000");
})