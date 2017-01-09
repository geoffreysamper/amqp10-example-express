require('dotenv').config();
var port = 8001;
var express = require('express');
var bodyParser = require('body-parser');
var http = require('http');
var sendToEventhub = require('./sendToEventHub');
var app = express();
var server = http.createServer(app);
app.use(bodyParser.urlencoded({ extended: false }));


server.listen(port, function () { 
  console.log("node listening on port "+ port)
});

app.post('/send', send);


function send(req, res){
      if (!req.body.data) {
        res.status(400, "request must have a body").send();
        
      }
      else {
        var json = JSON.parse(req.body.data);
        sendToEventhub(json, function(){ res.status(200).send();});

      }
       



      

}


app.get("/", function (req,res){res.send('ok')});





