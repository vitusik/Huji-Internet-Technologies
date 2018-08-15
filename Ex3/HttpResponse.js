
var HttpResponse = function (socket)
{
	this.protocol = "";
    this.stat = null;
    this.header = new Map();
    this.cookies = new Map();
	

	this.set = function (field, value)
	{
		if(value) 
		{
			this.header.set(field, value);
		}
		else
		{
			for(var prop in field)
			{
		    	this.header.set(prop, field[prop].toString());
			}
		}
	}

	this.status = function (status)
	{
		this.stat = status;
		return this;
	}

	this.get = function (field)
	{
		return this.header.get(field);
	}

	this.cookie = function (name, value, options)
	{
		this.cookies.set(name,{value:value, options:options});
	}

	this.send = function (body)
	{
		var status = "HTTP/1.1 " + this.stat + " OK\r\n";
        var head = '';
        var cookie = '';
		if(this.stat === 404  || this.stat === 500)
		{
			switch (this.stat)
			{
				case 404:
					status = "HTTP/1.1 " + this.stat + " Not Found";
					break;
				case 500:
					status = "HTTP/1.1 " + this.stat + " Server Error";
					break;	
			}
		}
		if(body === undefined)
		{
			body = ""
		}	
		if(typeof(body) === 'object')
		{
			body = JSON.stringify(body);
		}
		
		if(this.get("Content-Type") === undefined)
        {
        	this.set("Content-Type","text/plain");
        }
		if(this.header.get("Content-Length") === undefined)
        {
            if(body)
            {
                this.set("Content-Length", body.length);
            }
            else
            {
                this.set("Content-Length", "0");

            }
        }
        
        for(var key of this.header.keys())
        {
            head += key + ": " + this.header.get(key) + "\r\n";
        }


        if(this.cookies.size != 0)
        {
            cookie = 'Set-Cookie: '
        }
        for(var key of this.cookies.keys())
        {
            var value = this.cookies.get(key);
            cookie += key + "=" + value.value;
            for(var option in value.options)
            {
                cookie += ";" +  + value.options[option];
            }
            cookie += "\r\n";
        }
        var msg = status + head + cookie + "\r\n" + body;
        socket.write(msg);
        socket.destroy();
	    
    };
                
    this.json = function (body) 
    {
	    this.set("Content-Type","application/json");
        this.send(JSON.stringify(body));
    };
};

exports.HttpResponse = HttpResponse;
