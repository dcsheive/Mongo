Owl = require('../models/owls.js')
module.exports = {
    show:function(req,res){
        Owl.find({}, function(err, owls) {
            if(err) {
                console.log('something went wrong');
            } 
            else {
                return res.render('index', {owls:owls})
            }
        })
    },
    new:function(req,res){
        var owl = new Owl(req.body);
        owl.save(function(err){
            if(err){
                console.log("We have an error!", err);
                for(var key in err.errors){
                    req.flash('registration', err.errors[key].message);
                }
                res.redirect('/');
            }
            else {
                res.redirect('/');
            }
        });
    },
    getone:function(req,res){
        Owl.findById( req.params.id, function(err,owl) {
            if(err) {
                console.log('something went wrong');
                return res.redirect('/')

            } 
            else {
                return res.render('owldetails', {owl:owl})
            }
        })
    },
    update: function(req,res){
        Owl.findById(req.params.id, function(err, owl){
            owl.name = req.body.name
            owl.age = req.body.age
            owl.desc = req.body.desc
            owl.save(function(err){
                if(err) {
                    console.log('something went wrong');
                } 
                else {
                    return res.redirect('/owls/'+req.params.id)
                }
            })
        })
    },
    edit: function(req,res){
        Owl.findById( req.params.id, function(err,owl) {
            if(err || owl == null) {
                console.log('something went wrong');
                return res.redirect('/')
            } 
            else {
                return res.render('owledit', {owl:owl})
            }
        })
    },
    delete: function(req,res){
        Owl.findById(req.params.id, function(err, owl){
            owl.remove(function(err){
                if(err) {
                    console.log('something went wrong');
                } 
                else {
                    return res.redirect('/')
                }
            })
        })
    }

}
