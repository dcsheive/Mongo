Quote = require('../models/quotes.js')
module.exports = {
    create:function(req,res){
        var quote = new Quote(req.body);
        quote.save(function(err){
            if(err){
                console.log("We have an error!", err);
                for(var key in err.errors){
                    req.flash('registration', err.errors[key].message);
                }
                res.redirect('/');
            }
            else {
                res.redirect('/quotes');
            }
        })
    },
    show:function(req,res){
        Quote.find({}, function(err, quotes) {
            if(err) {
                console.log('something went wrong');
            } 
            else { 
                return res.render('quotes', {quotes:quotes})
            }
        })
    }   
}