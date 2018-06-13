const users = require('../controllers/users.js')
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
        return res.render('home',{user:req.session})
    })
    app.get('/logout',function(req,res){
        req.session.destroy()
        return res.redirect('/')
    })
    
    app.listen(8000, function() {
        console.log("listening on port 8000");
    })
    
}
