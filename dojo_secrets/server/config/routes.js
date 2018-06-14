const users = require('../controllers/users.js')
const secrets = require('../controllers/secrets.js')
const comments = require('../controllers/comments.js')
module.exports = function (app){
    app.get('/', function(req, res) {
        return res.render('index', {session:req.session})
    })
    app.post('/register', function (req, res){
        users.register(req,res)
    });
    
    app.post('/login', function(req,res){
        users.login(req,res)
    })
    
    app.get('/home',function(req,res){
        if (!req.session.user_id){
            return res.redirect('/')
        }
        secrets.getall(req,res)
    })
    app.get('/logout',function(req,res){
        req.session.destroy()
        return res.redirect('/')
    })
    app.post('/message', function (req, res){
        secrets.create(req,res)
    });
    app.post('/comment', function (req, res){
        comments.create(req,res)
    });
    app.post('/delete', function(req,res){
        
    })
    
    app.listen(8000, function() {
        console.log("listening on port 8000");
    })
    
}
