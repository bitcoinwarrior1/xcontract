(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/**
 * Created by sangalli on 19/4/17.
 */

let injectedProvider;
let web3;
let web3Handler = require("./Web3Handler.js");
let contract;

$(function()
{
    function setWeb3(abi, contractAddress)
    {
        if (typeof window.web3 !== 'undefined')
        {
            injectedProvider = window.web3.currentProvider;
            web3 = new Web3(injectedProvider);
            console.log("injected provider used: " + injectedProvider);
            alert("using provider: " + injectedProvider);
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

        if(e.target.id == "submit") return; //not a function call so should stop now

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

},{"./Web3Handler.js":2}],2:[function(require,module,exports){
module.exports = {

     extractAbiFunctions : (abi) =>
     {
        let arrayOfFunctionObjects = [];

        for(i=0; i < abi.length; i++)
        {
            if(abi[i].type == "function")
            {
                arrayOfFunctionObjects.push(abi[i]);
            }
        }
        return arrayOfFunctionObjects;
    },

    getContract : (abi, address) =>
    {
        return web3.eth.contract(abi).at(address);
    },

    getContractFunctionNamesAndParams : (abiFunctions) =>
    {
        let nameAndParamObj = {};

        let functionNameFields = [];
        let functionParamFields = [];

        for(abiFunc of abiFunctions)
        {
            let functionName = abiFunc.name;
            let functionParams = JSON.stringify(abiFunc.inputs[0]);
            console.log("Index: " + functionName);
            //create jade elements for each function with name and param
            functionNameFields.push(functionName);
            functionParamFields.push(functionParams);
        }

        nameAndParamObj.names = functionNameFields;
        nameAndParamObj.params = functionParamFields;

        return nameAndParamObj;
    },

    createFunctionsFromAbi : (functionNames, functionParams, address) =>
    {
         let functionsInAbi = [];

         for(i = 0; i < functionNames.length; i ++)
         {
             let contractFunction = new Function(params)
             {
                 web3.eth[functionNames[i].toString()].sendTransaction(
                     params, {to: address, from:eth.coinbase }
                     );
             }
             functionsInAbi.push(contractFunction);
         }

         return functionsInAbi;
    },

    executeContractFunction : (contract, functionName, params) =>
    {
         //must use bracket notation as function name is passed as a string
         if(params == null)
         {
             contract[functionName](function(err, data)
             {
                 if(err) console.log("error: " + err);
                 else console.log("here is the response from web3: " + data);
             });
         }
         else
         {
             contract[functionName](params, function(err, data)
             {
                 if(err) console.log("error: " + err);
                 else console.log("here is the response from web3: " + data);
             });
         }
    },

    sendEtherToContract : (value, contractAddress, web3) =>
    {
         web3.eth.sendTransaction({to: contractAddress, from: eth.coinbase, value: value });
    }

};

},{}]},{},[1]);
