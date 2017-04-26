/**
 * Created by sangalli on 19/4/17.
 */

let injectedProvider;
let web3;
let web3Handler = require("./Web3Handler.js");
let contract;
let request = require("superagent");

$(function()
{
    function setWeb3(abi, contractAddress)
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
            alert("no injected provider found, using localhost:8545");
        }

        //let's assume that coinbase is our account
        web3.eth.defaultAccount = web3.eth.coinbase;

        //sets the contract
        try
        {
            contract = web3.eth.contract(abi).at(contractAddress);

            // let etherScanApi = "http://api.etherscan.io/api?module=contract&action=getabi&address=";
            //
            // request.get(etherScanApi + contractAddress, (error, data) =>
            // {
            //     if(error) throw error;
            //
            //     if(data.body.message === "NOTOK")
            //     {
            //         alert("Warning! Contract source code is not verified!");
            //     }
            //     else alert("Contract source code is verified!");
            // });
        }
        catch(exception)
        {
            console.log("contract failed to load, error: " + exception);
        }

    }

    $(':button').click(function(e)
    {
        let abi = JSON.parse($("#ABI").val());
        let contractAddress = $("#contractAddress").val();

        if(abi == "" || contractAddress == "")
        {
            alert("missing abi and/or contract");
            return;
        }

        setWeb3(abi, contractAddress);

        if(e.target.id == "submit")
        {
            window.location.replace("/api/" + JSON.stringify(abi) + "/" +contractAddress);
            return; //not a function call so should stop now
        }

        let functionCalled = e.target.id;
        console.log("Button " + functionCalled + " was clicked!");
        extractTransactionInfo(functionCalled, abi, contractAddress);

    });

    function extractTransactionInfo(functionCalled, abi, contractAddress)
    {
        //remove strings and get index number
        let functionParamPos = functionCalled.substring(functionCalled.indexOf("&"));
        let paramNumber = functionParamPos.replace( /^\D+/g, '');
        let params = getParamsFromFunctionName(paramNumber);

        let txObj = {};
        //remove html index number from method call name
        txObj.functionCalled = functionCalled.replace("&" + paramNumber, '');
        txObj.abi = abi;
        txObj.contractAddress = contractAddress;

        try
        {
            //handles NPE on parameter-less contract functions
            txObj.filledOutParams = document.getElementById(params).value; //gets the user input from textbox
        }
        catch(exception)
        {
            console.log("param is null: " + exception);
            txObj.filledOutParams = null;
        }

        console.log("filled out params from user input: " + txObj.filledOutParams);

        initTransaction(txObj);
    }

    function initTransaction(txObj)
    {
        console.log("transaction initiated");

        try
        {
            web3Handler.executeContractFunction(contract, txObj.functionCalled, txObj.filledOutParams);
        }
        catch(exception)
        {
            console.log("transaction failed. Error: " + exception);
        }
    }

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

});
