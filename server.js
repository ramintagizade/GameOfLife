var express = require("express");
var path = require("path");
var compression = require("compression");
var favicon  = require("serve-favicon");

const port = process.env.PORT || 3000;
var app = express();

app.use(compression());
app.use(express.static("dist"));
app.use(favicon(path.join(__dirname,'dist','favicon.ico')));

app.get("*",function(req,res){
	res.sendFile(path.join(__dirname,"dist/index.html"));
});

app.listen(port,function(){
	console.log("server runs on port " + port);
});
