let Web3 = require("web3");
let web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));
let web3Handler = require("./Web3Handler.js");
let contract;
const domainDNS = "https://xcontract.herokuapp.com";
let clipboard = require("clipboard-polyfill");

$(() =>
{
    //check if plugin node is available if not use localhost
    if (typeof window.web3 !== 'undefined')
    {
        let injectedProvider = window.web3.currentProvider;
        web3 = new Web3(injectedProvider);
        console.log("injected provider used");
        web3.eth.defaultAccount = web3.eth.coinbase;
        let version = web3.version.api;
        if(version > 1) injectedProvider.enable();
        web3Handler.getNetworkName(web3, (network) =>
        {
            $("#network").text("Current network: " + network);
            $("#userAddress").text("Your address: " + web3.eth.coinbase);
        });
    }
    else
    {
        alert(
            "no injected provider found, using localhost:8545," +
            " please ensure your local node is running " +
            "with rpc and rpccorsdomain enabled"
        );
    }

    function setWeb3(abi, contractAddress)
    {
        //sets the contract
        try
        {
            //must set the default account otherwise you can get unexpected errors
            web3.eth.defaultAccount = web3.eth.coinbase;
            contract = web3.eth.contract(abi).at(contractAddress);
        }
        catch(exception)
        {
            alert("contract failed to load, error: " + exception);
        }
    }

    function signAction()
    {
        let account = web3.eth.defaultAccount;
        console.log("Here is the account: " + account);
        let message = $("#messageBox").val();
        console.log("message to sign: " + message);
        web3Handler.signMessage(web3, account, message, (err, data) =>
        {
            $("#output").val(data);
        });
    }

    function verifyAction()
    {
        let message = $("#verifyMessageBox").val();
        let signature = $("#signatureBox").val();
        web3Handler.verify(web3, message, signature, (address) =>
        {
            $("#verificationAddressBox").val(address);
        });
    }

    $("#signButton").click(() =>
    {
        signAction();
    });

    $("#verifyButton").click(() =>
    {
        verifyAction();
    });

    $("#etherScanURLButton").click(() =>
    {
        let contractAddress = $("#contractAddress").val().trim();
        web3Handler.redirectToEtherscan(web3, contractAddress);
    });

    $("#submit").click(() =>
    {
        $("#copyToClipboard").show();
        let abi = $("#ABI").val().trim();
        let contractAddress = $("#contractAddress").val().trim();
        window.location.href = "/api/" + abi + "/" + contractAddress;
    });

    $("#copyToClipboard").click(() =>
    {
       let url = domainDNS + "/api/" +  $("#contractAddress").val().trim();
        clipboard.writeText(url).then((err, data) => {
            alert("copied to clipboard!");
        });
    });

    //this is needed because function buttons are created on the fly so we cannot know in advance their elements
    $(':button').not(
        "#signButton",
        "#etherScanURLButton",
        "#submit",
        "#balanceBox",
        "#verifyButton",
        "#copyToClipboard").click((e) =>
    {
        console.log("button clicked: " + e.target.id);
        let contractAddress = $("#contractAddress").val().trim();
        let abi = $("#ABI").val().trim();
        if(!web3Handler.checkAddressValidity(web3, contractAddress))
        {
            alert("missing or invalid contract address: " + contractAddress);
            location.reload();
            return;
        }
        //if no abi is provided redirect to verified contract url, if verified then no ABI is needed
        if(abi == "")
        {
            //let the server check if the contract abi is verified and available
            window.location.href = "/api/" + contractAddress;
            return;
        }
        let jsonABI = JSON.parse(abi);
        setWeb3(jsonABI, contractAddress);
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
        let functionName = functionCalled.substring(0, functionCalled.indexOf("&"));
        let functionObject = getFunctionObjectFromAbi(functionName, JSON.parse(abi));
        let functionArgCount = functionObject.inputs.length;
        let txObj = {};
        let parameters = [];
        //remove html index number from method call name
        txObj.functionCalled = functionName;
        txObj.abi = abi;
        txObj.contractAddress = contractAddress;
        //get the length of function args and add them to the param number
        let start = parseInt(paramNumber) + 1;
        let end = parseInt(functionArgCount) + start;
        for(let i = start; i < end; i++)
        {
            let filledParam = $("#" + i).val();
            parameters.push(filledParam);
        }
        txObj.isPayable = false;
        if(JSON.stringify(functionObject).includes('"payable":true'))
        {
            txObj.isPayable = true;
            parameters.push('{"name":"value","type":"uint256"}');
        }
        txObj.filledOutParams = parameters;
        initTransaction(contract, txObj);
    }

    function getFunctionObjectFromAbi(functionName, abi)
    {
        for(let i = 0; i < abi.length; i++)
        {
            if(abi[i].name.includes(functionName))
            {
                return abi[i];
            }
        }
    }

    function initTransaction(contract, txObj)
    {
        console.log("here is the txOBj " + JSON.stringify(txObj.filledOutParams))
        try
        {
            web3Handler.executeContractFunction(contract, txObj, (data) =>
            {
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
