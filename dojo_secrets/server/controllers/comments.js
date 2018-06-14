let Comment = require('../models/comments.js')
let Secret = require('../models/secrets.js')
module.exports = {
    create: function(req,res){
        var comment = new Comment(req.body);
        comment.save(function(err){
            if(err){
                console.log("We have an error!", err);
                for(var key in err.errors){
                    req.flash('comment', err.errors[key].message);
                }
                res.redirect('/home');
            }
            else {
                Secret.findById(comment.secret, function(err,message){
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
                                res.redirect('/home')
                            }
                        
                        })
                    }
                })
            }
        })
    }
}
