/**
 * Created by sangalli on 19/4/17.
 */
let request = require("superagent");

$(function()
{
    $(':button').click(function(e)
    {
        let abi = $("#ABI").val();
        let contractAddress = $("#contractAddress").val();
        if(abi == "" || contractAddress == "")
        {
            alert("missing abi and/or contract");
            return;
        }
        let idClicked = e.target.id;
        console.log("Button " + idClicked + " was clicked!");

        callServerToExecuteFunction(idClicked, abi, contractAddress);
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

});
