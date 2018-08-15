
var httprequest = require('./HttpRequest');
var requestParser = require('./requestParser');
var httpResponse = require('./HttpResponse');
var Route = require('route-parser');
var net = require("net");

//hujiwebserver.js:
module.exports = {
    commands:[],
    use: function(c,mw)
    {
        this.commands.push({
            command:c,
            middleware:mw
        });
        return this;
    },
    start :function(p,c)
    {
        var receivedData = "";
        var commands = this.commands;
        var server = net.createServer(function (socket,err) {
            if(err) 
            {
            callback(err);
            return;
            } 
            var timeout = 25000;
            socket.setEncoding('utf8');
            socket.setTimeout(timeout, function(){
                socket.end("Timeout");
                socket.destroy();
            })
            socket.on('data', function(data,err){
                if(err)
                 {
                    callback(err);
                    return;
                }
                receivedData += data.toString();
                var searchTime = 10000;
                var req = new httprequest.HttpRequest();
                var res = new httpResponse.HttpResponse(socket);
                // create req obj without body
                requestParser.parse(req,receivedData);
                
                if(!ParsingTest(req))
                {
                    res.status(500).send();
                }
                // check if the body of the request was fully transfered
                //if(req.body == null && req.contentLen == null)
                if(req.contentLen === req.body.length || req.contentLen == null)
                {   
                    setTimeout(function(){
                        if(!socket.destroyed)
                        {
                            res.status(404).send();    
                        }
                    }, searchTime);
                    for(i in commands)
                    {
                        var route = new Route(commands[i].command);
                        //this part is a string manipulation, for case when the path of command is very general relative to path of req
                        // resulting in route-parser missing a match of command and req.path                            
                        var splitCommand = commands[i].command.split('/');
                        var splitPath = req.path.split('/');
                        var lenghtDiff = splitPath.length - splitCommand.length;                    
                        for (var l = 0 ; l < lenghtDiff; l++)
                        {
                            splitPath.pop()
                        }
                        var pathToMatch = splitPath.join('/')                        
                        if(route.match(pathToMatch))
                        {
                            req.params = route.match(pathToMatch);
                            next = function()
                            {
                                // upon calling next the mw fucntion just returns, and the for loop continues
                                return;
                            }
                            commands[i].middleware(req,res,next);
                            break;
                        }
                    }
                    //res.status(404).send();
                }
            })
        }).listen(p);
        
        return serverObj =
        {
            port:p,
            stop: function() 
                {
                    server.close();
                }
        }
    }
    
}

function ParsingTest(req)
{
    if (req.protocol == null)
    {
    return false;
    }
    if (req.host == null)
    {
        return false;
    }
    if (req.path  == null)
    {
        return false;
    }

    return true;
}

