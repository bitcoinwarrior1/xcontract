/**
 * Created by sangalli on 19/4/17.
 */
let request = require("superagent");

$(function()
{
    //TODO get id number from name and match it to params id number
    //TODO then use that to get param and send it to server
    $(':button').click(function(e)
    {
        let abi = $("#ABI").val();
        let contractAddress = $("#contractAddress").val();
        let param = "";

        if(abi == "" || contractAddress == "")
        {
            alert("missing abi and/or contract");
            return;
        }
        let functionCalled = e.target.id;
        console.log("Button " + functionCalled + " was clicked!");

        callServerToExecuteFunction(functionCalled, abi, contractAddress);
    });

    //TODO use object for param
    function callServerToExecuteFunction(functionCalled, abi, contractAddress, filledOutParams)
    {
        request.get("/function/" + functionCalled + "/" + abi + "/" + contractAddress +
            "/" + filledOutParams, (err, data) =>
        {
            if(err)
            {
                alert("error, function call failed, reason: " + err);
            }
            else
            {
                console.log(data.body);
                alert("function call successful");
            }
        });
    }

});
