/**
 * Created by sangalli on 19/4/17.
 */
let request = require("superagent");

$("button").click(function(e)
{
    let idClicked = e.target.id;
    console.log("Button " + idClicked + " was clicked!");
});

function callServerToExecuteFunction(functionCalled, abi, contractAddress)
{
    request.get("/function/" + functionCalled + "/" + abi + "/" + contractAddress, (err, data) =>
    {
        if(err)
        {
            alert("error, function call failed, reason: " + err);
        }
        else
        {
            alert("function call successful");
        }
    });
}
