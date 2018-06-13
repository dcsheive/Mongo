User = require('../models/users.js')
const bcrypt = require('bcrypt');

module.exports = {
    register: function(req,res){
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
    },
    login: function(req,res){
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
    }
}