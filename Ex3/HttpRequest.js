var HttpRequest = function()
{
	this.contenttype = "",
	this.params = {},
	this.query ={},
	this.method = null,
	this.cookies = {},
	this.path = null,
	this.host = null,
	this.protocol = null,
	this.body = "",
    this.contentLen = null,

	this.get = function(field) 
	{
		if(field == "Content-Type" || field == "content-type")
		{
			return this.contenttype;	
		}
		return undefined;
		
	},

	this.param = function(name) 
	{
		
		if (this.params[name] !== undefined) 
		{
            return this.params[name];
        }
        if (this.query[name] !== undefined) 
        {
            return this.query[name];
        }
        return null;
	},

	this.is = function(type) 
	{
		if (supportedFiles[type] === this.contenttype) 
		{

            return true;
        }
        if (type===this.contenttype) 
        {
             return true;
            }
        return false;
	}
};

exports.HttpRequest = HttpRequest;