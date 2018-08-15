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

	this.get = function(filed) 
	{
		return this.contenttype;
	},

	this.param = function(name) 
	{
		if (HttpRequest.params[name] !== undefined) 
		{
            return HttpRequest.params[name];
        }
        if (HttpRequest.query[name] !== undefined) 
        {
            return HttpRequest.query[name];
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