var hujiwebserver = require('./hujiwebserver');
var fs = require('fs')
var path = require('path')

var gambling = {"ones":0,"zeroes":0};

var supportedFiles = 
    {
        "txt" : "text/plain",
        "json" : "application/json",
        "js" : "application/javascript",
        "html" : "text/html",
        "css" : "text/css",
    };

var PORT = 8080;


var server = hujiwebserver.start(PORT, function(err) {
    if (err) {
        console.log("could not start the server" + err);
        return;
    }

});

hujiwebserver.use("/www/Binary.html", function (req, res, next) {

    res.status(200);

    fs.readFile(path.join("/" + __dirname + "/" + req.path),'utf-8', function (err,data){
        if(err)
        {
            console.log(err)
        }
        var ex = path.extname(req.path)
        ex = ex.substr(1)


        res.set("Content-Type",supportedFiles[ex])
        res.send(data)
    });
});

hujiwebserver.use("/www/style.css", function (req, res, next) {

    res.status(200);
    
    fs.readFile(path.join("/" + __dirname + "/" + req.path),'utf-8', function (err,data){
        if(err)
        {
            console.log(err)
        }
        var ex = path.extname(req.path)
        ex = ex.substr(1)


        res.set("Content-Type",supportedFiles[ex])
        res.send(data)
    });
});

hujiwebserver.use("/www/Binary_js.js", function (req, res, next) {

    res.status(200);

    fs.readFile(path.join("/" + __dirname + "/" + req.path),'utf-8', function (err,data){
        if(err)
        {
            console.log(err)
        }
        var ex = path.extname(req.path)
        ex = ex.substr(1)
        res.set("Content-Type",supportedFiles[ex])
        res.send(data)
    });
});


hujiwebserver.use("/www/gamble/0", function (req, res, next) {
    res.status(200);
    gambling["zeroes"] = gambling["zeroes"] + 1;
    res.json(gambling);
});

hujiwebserver.use("/www/gamble/1", function (req, res, next) {
    res.status(200);
    gambling["ones"] = gambling["ones"] + 1;
    res.json(gambling);
});

hujiwebserver.use("/www/gamble/reset", function (req, res, next) {

    res.status(200);
    gambling = {"ones":0,"zeroes":0};
    res.json(gambling);
});