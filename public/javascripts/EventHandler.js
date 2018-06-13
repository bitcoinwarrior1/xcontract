let injectedProvider;
let Web3 = require("web3");
let web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));
let web3Handler = require("./Web3Handler.js");
let contract;
let defaultAccount;

$(() =>
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
    defaultAccount = web3.eth.coinbase;

    function setWeb3(abi, contractAddress)
    {
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

    function redirectToEtherscan(address)
    {
        web3.version.getNetwork((err, networkId) => {
            if (networkId == 3) window.location.href("https://ropsten.etherscan.io/address/" + address, '_blank');
            else if (networkId == 4) window.location.href("https://rinkeby.etherscan.io/address/" + address, '_blank');
            else if (networkId == 42) window.location.href("https://kovan.etherscan.io/address/" + address, '_blank');
            else window.location.href("https://etherscan.io/address/" + address, '_blank');
        });
    }

    function functionSignAction()
    {
        console.log("Here is the account: " + defaultAccount);
        let message = $("#messageBox").val();
        console.log("message to sign: " + message);
        web3Handler.sign(web3, defaultAccount, message,
            (err, data) =>
            {
                $("#output").val(data);
            });
    }

    $(':button').click(function(e)
    {
        let contractAddress = $("#contractAddress").val().trim();
        let abi = $("#ABI").val().trim();
        let jsonABI;

        console.log("button clicked: " + e.target.id);
        if(e.target.id == "signButton") functionSignAction();
        if(e.target.id == "etherScanURLButton") redirectToEtherscan(contractAddress);

        if(!web3Handler.checkAddressValidity(web3, contractAddress))
        {
            alert("missing or invalid contract address: " + contractAddress);
            return;
        }
        //if no abi is provided redirect to verified contract url, if verified then no ABI is needed
        if(abi == "")
        {
            //let the server check if the contract abi is verified and available
            window.location.href("/api/" + contractAddress);
            return;
        }
        else
        {
            jsonABI = JSON.parse(abi);
        }

        setWeb3(jsonABI, contractAddress);

        if(e.target.id == "submit")
        {
            window.location.href("/api/" + JSON.stringify(jsonABI) + "/" +contractAddress);
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
        let paramNumber = functionParamPos.replace(/^\D+/g, '');
        let txObj = {};
        //remove html index number from method call name
        txObj.functionCalled = functionCalled.replace("&" + paramNumber, '');
        txObj.abi = abi;
        txObj.contractAddress = contractAddress;

        let param = $("#" + paramNumber).val();
        let payable = false;
        if(param != "")
        {
            if(param.includes("payable")) payable = true;
            txObj.filledOutParams = param.split(",");
        }
        else txObj.filledOutParams = null;

        txObj.isPayable = payable;

        initTransaction(contract, txObj);
    }

    function initTransaction(contract, txObj)
    {
        console.log(txObj.filledOutParams);
        try
        {
            console.log("Function called: " + txObj.functionCalled);
            web3Handler.executeContractFunction(contract, txObj, (data) => {
                    console.log("tx data: " + data);
                    alert("web3 response: " + data);
            });
        }
        catch(exception)
        {
            console.log("transaction failed." + exception);
        }
    }

});
