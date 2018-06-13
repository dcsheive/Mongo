const quotes = require('../controllers/quotes.js')
module.exports = function(app){
    app.get('/', function(req, res) {
        return res.render('index')
    })
    app.post('/quotes', function (req, res){
        quotes.create(req,res)
    });
    app.get('/quotes',function(req,res){
        quotes.show(req,res)
    })
    app.listen(8000, function() {
    console.log("listening on port 8000");
})
}
