const owls = require('../controllers/owls.js')
module.exports = function(app){
    app.get('/', function(req, res) {
        owls.show(req,res)
    })
    app.get('/owls/new',function(req,res){
        return res.render('newowls')
    }) 
    app.post('/owls', function (req, res){
        owls.new(req,res)
    });
    app.get('/owls/:id',function(req,res){
        owls.getone(req,res)
    })
    app.post('/owls/:id',function(req,res){
        owls.update(req,res)
    })
    app.get('/owls/:id/edit',function(req,res){
        owls.edit(req,res)
    })
    app.post('/owls/:id/delete',function(req,res){
        owls.delete(req,res)
    })
    app.listen(8000, function() {
        console.log("listening on port 8000");
    })
}