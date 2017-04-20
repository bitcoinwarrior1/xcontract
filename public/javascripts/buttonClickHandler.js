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
        let functionCalled = e.target.id;
        console.log("Button " + functionCalled + " was clicked!");
        //remove strings and get number
        let params = getParamsFromFunctionName(functionCalled.replace( /^\D+/g, ''));

        let serverObj = {};
        serverObj.functionCalled = functionCalled;
        serverObj.abi = abi;
        serverObj.contractAddress = contractAddress;
        serverObj.filledOutParams = params;

        callServerToExecuteFunction(serverObj);
    });

    function getParamsFromFunctionName(paramNumber)
    {
        console.log("here is the param number " + paramNumber);

        $(':input').not("#ABI, #contractAddress, button").each(function()
            {
                let inputId = $(this).attr("id");

                //removes false positives with var types such as uint256
                let filteredInput = inputId.substring(inputId.indexOf("}"));

                for(id of filteredInput)
                {
                    let index = 0;
                    if(id.includes(paramNumber) && !id.includes("function")) //separates from function names
                    {
                        let element = $(this).attr("id");
                        console.log("these are the params for the function: " + element);
                        return element;
                    }
                }

                return null; //will return null if it is a parameter-less function
            }
        );

    }

    function callServerToExecuteFunction(serverObj)
    {
        request.get("/function/" + serverObj.functionCalled + "/" + serverObj.abi + "/" +
            serverObj.contractAddress +
            "/" + serverObj.filledOutParams, (err, data) =>
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
