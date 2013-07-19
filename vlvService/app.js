var express = require("express");
var app= express();

var vlv= require("./vlv.js");

app.set('port', process.env.PORT || 3000);
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);

app.use(function(err, req, res, next){
  console.error(err.stack);
  res.send(500, 'Something broke!');
});

app.get("/", function(req, res){
  console.log(req.query);
  var callback = function (json){
    res.type("json");
    res.json(json);
    res.end();
  }
  if(req.query.short && req.query.fs){
    vlv.getEvents(req.query.short, req.query.fs, callback);
  }else{
    vlv.getCourses(callback);
  }
});

app.listen(3000);
console.log('Listening on port 3000');