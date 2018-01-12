let injectedProvider;
let Web3 = require("web3");
let web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));
let web3Handler = require("./Web3Handler.js");
let contract;

$(() =>
{
    function setWeb3(abi, contractAddress)
    {
        //check if plugin node is available if not use localhost
        if (typeof window.web3 !== 'undefined')
        {
            injectedProvider = window.web3.currentProvider;
            web3 = new Web3(injectedProvider);
            console.log("injected provider used: " + injectedProvider);
        }
        else
        {
            alert("no injected provider found, using localhost:8545, please ensure your local node is running " +
                "and rpc and rpccorsdomain is enabled");
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
        let contractAddress = $("#contractAddress").val().trim();
        let abi = $("#ABI").val().trim();
        let jsonABI;

        if(!web3Handler.checkAddressValidity(contractAddress))
        {
            alert("missing or invalid contract address: " + contractAddress);
            return;
        }
        //if no abi is provided redirect to verified contract url, if verified then no ABI is needed
        if(abi == "")
        {
            //let the server check if the contract abi is verified and available
            window.location.replace("/api/" + contractAddress);
            return;
        }
        else
        {
            jsonABI = JSON.parse(abi);
        }

        setWeb3(jsonABI, contractAddress);

        if(e.target.id == "submit")
        {
            window.location.replace("/api/" + JSON.stringify(jsonABI) + "/" +contractAddress);
            return; //not a function call so should stop now
        }

        let functionCalled = e.target.id;
        console.log("Button " + functionCalled + " was clicked!");
        extractTransactionInfo(functionCalled, abi, contractAddress);
    });

    //gets the transaction info for one function call at a time
    function extractTransactionInfo(functionCalled, abi, contractAddress)
    {
        //remove strings and get index number
        let functionParamPos = functionCalled.substring(functionCalled.indexOf("&"));
        let paramNumber = functionParamPos.replace( /^\D+/g, '');
        let txObj = {};
        //remove html index number from method call name
        txObj.functionCalled = functionCalled.replace("&" + paramNumber, '');
        txObj.abi = abi;
        txObj.contractAddress = contractAddress;

        let param = $("#" + paramNumber).val();
        if(param != "") txObj.filledOutParams = param.split(",");
        else txObj.filledOutParams = null;

        initTransaction(txObj);
    }

    function initTransaction(txObj)
    {
        console.log(txObj.filledOutParams);
        try
        {
            web3Handler.executeContractFunction(contract, txObj.functionCalled,
                txObj.filledOutParams, (data) => {
                console.log("tx data: " + data);
                alert("web3 response: " + data);
            });
        }
        catch(exception)
        {
            if(exception == "Error: Cannot send value to non-payable function")
            {
                alert("You cannot send ether to a non payable function, retrying transaction without ether added");
                txObj.filledOutParams.push(0); //value is popped in executeContractFunction so it is re-added as 0
                initTransaction(txObj);
            }
            console.log("transaction failed." + exception);
        }
    }
});
