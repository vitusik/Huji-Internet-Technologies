
document.getElementById("b1").setAttribute('onclick',"post(1)");
document.getElementById('b0').setAttribute('onclick',"post(0)");
document.getElementById('ng').setAttribute('onclick',"reset()");

function reset(){
	var postReq = new XMLHttpRequest();
	postReq.open('DELETE','gamble/reset', true);
	postReq.send(null);
	postReq.onreadystatechange = function(){
		if(postReq.readyState === XMLHttpRequest.DONE)
		{
			if(postReq.status === 200)
			{
				document.getElementById('b1').style.display = 'none';
				document.getElementById('b0').style.display = 'none';
			}
		}
	}
}

function post(choice){
	var postReq = new XMLHttpRequest();
	postReq.open('POST','gamble/' + choice, true);
	postReq.send(null);
	postReq.onreadystatechange = function(){
		if(postReq.readyState === XMLHttpRequest.DONE)
		{
			if(postReq.status === 200)
			{
				var result = JSON.parse(postReq.responseText);
				var status = game_status(choice,result);
				var internalGambling = {1:"ones",0:"zeroes"};
				var helpVar = internalGambling[choice];
				if((result["zeroes"] === 0 && result["ones"] === 0))
				{
					result[helpVar] = 0;
				}
				result = JSON.stringify(result);
				document.getElementById('b1').style.display = 'none';
				document.getElementById('b0').style.display = 'none';
				document.getElementById('result').appendChild(document.createTextNode(result));
				document.getElementById('result').appendChild(document.createElement("br"));
				document.getElementById('result').appendChild(document.createTextNode("You Have " + status));
				document.getElementById('result').appendChild(document.createElement("br"));
			}
		}
	}
}

function game_status(choice, gambling){
	var winner;
	var internalGambling = {1:"ones",0:"zeroes"};
	var helpVar = internalGambling[choice];
	gambling[helpVar] -= 1;
	if(gambling["ones"] === gambling["zeroes"])
	{
		return "tie";
	}
	else
	{
		if(gambling["ones"] > gambling["zeroes"])
		{
			winner = "zeroes";
		}
		else
		{
			winner = "ones";
		}
	}
	if(helpVar === winner)
	{
		return "won";
	}
	else
	{
		return "lost";
	}
}

