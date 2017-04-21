/**
 * Created by sangalli on 19/4/17.
 */

let request = require("superagent");
let injectedProvider;
let web3;

//TODO handle callback from server to then execute web3 transaction on the client side
$(function()
{
    if (typeof window.web3 !== 'undefined')
    {
        injectedProvider = window.web3.currentProvider;
        web3 = new Web3(injectedProvider);
        console.log("injected provider used: " + injectedProvider);
    }
    else
    {
        console.log("no injected provider found, using localhost:8545");
        web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));
    }

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
        //remove strings and get index number
        let paramNumber = functionCalled.replace( /^\D+/g, '');
        let params = getParamsFromFunctionName(paramNumber);

        let serverObj = {};
        serverObj.functionCalled = functionCalled;
        serverObj.abi = abi;
        serverObj.contractAddress = contractAddress;
        try
        {
            serverObj.filledOutParams = document.getElementById(params).value; //gets the user input from textbox
        }
        catch(exception)
        {
            console.log("param is null: " + exception);
        }
        finally
        {
            serverObj.filledOutParams = null;
        }

        console.log("filled out params from user input: " + serverObj.filledOutParams);

        callServerToExecuteFunction(serverObj);

    });

    function getParamsFromFunctionName(paramNumber)
    {
        console.log("here is the param number " + paramNumber);

        let element = null;

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
                        element = $(this).attr("id");
                        console.log("these are the params for the function: " + element);
                        break;
                    }
                }

            }
        );

        //will return null if it is a parameter-less function
        return element;
    }

    ///function/:functionInfo/:abi/:address/:filledOutParams
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
