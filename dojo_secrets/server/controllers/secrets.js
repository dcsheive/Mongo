let Secret = require('../models/secrets.js')
module.exports = {
    create: function (req,res){
        var secret = new Secret(req.body);
        secret.save(function(err){
            if(err){
                console.log("We have an error!", err);
                for(var key in err.errors){
                    req.flash('secret', err.errors[key].message);
                }
                res.redirect('/home');
            }
            else {
                res.redirect('/home');
            }
        });
    },
    getall: function(req,res){
        Secret.find({}).populate('comments').exec(function(err, secrets){
            if (err){
                console.log("We have an error!", err);
            }
            else{
                return res.render('home',{user:req.session, secrets:secrets})
            }
        })
    },
    delete: function(req,res){
        Secret.remove({_id:req.body.secret_id}, function (err){
            if (err){
                console.log("We have an error!", err);
            }
            else{
                return res.redirect('/home')
            }
        })
    }
}