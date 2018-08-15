var url = require('url');
var httprequest = require('./HttpRequest');


function parse(req,dataString) 
{
	var supportedFiles = 
	{
		"txt" : "text/plain",
        "json" : "application/json",
        "js" : "application/javascript",
        "html" : "text/html",
        "css" : "text/css",
    };

    var ready_for_body = false;
    var finished_with_body = false;
    var even = true;
    var len = null;
    var splitString = dataString.split("\r\n");
    for (var i in splitString) 
    {
        if(splitString[i] === "" && req.contentLen != null)
        {
            ready_for_body = true;
            
        }

        if(ready_for_body && !finished_with_body)
        {
            if(req.contentLen > req.body.length)
            {
                req.body += splitString[i];  
                if(req.contentLen < req.body.length)
                {
                    req.body = req.body.slice(0,req.contentLen);
                    finished_with_body = true;
                }      
            }
            else
            {
                finished_with_body = true;
            }

        }

        if (/^(GET)|^(POST)|^(PUT)|^(DELETE)|^(OPTIONS)|^(TRACE)/.test(splitString[i])) 
        {
            initalRequest(splitString[i], req);
            continue;
        }

        if (/^(Host:)/.test(splitString[i])) 
        {
            requestHost(splitString[i], req)
            continue;
        }


        if (/^(Content-Length:)/.test(splitString[i])) 
        {
            req.contentLen = parseInt(splitString[i].split(/\s/)[1]);
            req.body = "";
            continue;
        }

        if (/^(Content-Type:)/.test(splitString[i])) 
        {
        	// for example Content-Type: text/xml; charset=utf-8
        	// tmp1 is  text/xml; charset=utf-8
            tmp1 = splitString[i].split(':')[1];
            // tmp2 is  text/xml
            tmp2 = tmp1.split(';')[0];
            // tmp3 remove one extra whitespace at the beginging of the string
            tmp3 = tmp2.substr(1);
            req.contenttype = (tmp3);
            continue;
        }

        if (/^(Cookie:)/.test(splitString[i])) {
            requestCookies(splitString[i],req);
            continue;
        }
    }
};

function initalRequest(str, req) 
{
    var curLine = str.split(/\s/)
    req.method = curLine[0];
    req.path = (curLine[1].split('?'))[0];
    req.query = url.parse(curLine[1],true).query;
    tmp = curLine[2];
    if(!(/^HTTP/.test(tmp)))
    {
        
        req.protocol = null;

    }
    else
    {
        req.protocol = "http";
    }

}

function requestHost(str, req) 
{
        var str = str.split(/\s/);
        str = str[1].split(':')
        req.host = str[0];
}

function requestCookies(str, req) 
{
    var req1 = str.split(':');
    var req2 = req1[1]
    var req3 = req2.split(';');

    for (var ln in req3) 
    {
        tmp = req3[ln].split('=')
        req.cookies[tmp[0].substr(1)] = tmp[1];

	}
}

exports.parse = parse;
