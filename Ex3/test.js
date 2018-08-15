var hujiwebserver = require('./hujiwebserver');
var fs = require('fs')
var path = require('path')


var PORT = 8080;


var server = hujiwebserver.start(PORT, function(err) {
    if (err) {
        console.log("could not start the server" + err);
        return;
    }

});

hujiwebserver.use("/hello/world", function (req, res, next) {
    res.status(200);
    res.send("hello world");
});

hujiwebserver.use("/add/:n/:m", function (req, res, next) {
    res.status(200);
    var a = req.params["n"];
    var b = req.params["m"];
    res.json(JSON.stringify({result:a*b}));
});


hujiwebserver.use("/filez/", function (req, res, next) {
    var supportedFiles = 
    {
        "txt" : "text/plain",
        "json" : "application/json",
        "js" : "application/javascript",
        "html" : "text/html",
        "css" : "text/css",
    };
    res.status(200);
    fs.readfile(path.join("/" + __dirname + "/" + req.path),'utf-8', function(err,data)
    {
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

