let Web3 = require("web3");
let web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));
let web3Handler = require("./Web3Handler.js");
let contract;

$(() =>
{
    //check if plugin node is available if not use localhost
    if (typeof window.web3 !== 'undefined')
    {
        const injectedProvider = window.web3.currentProvider;
        web3 = new Web3(injectedProvider);
        console.log("injected provider used: " + injectedProvider);
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
            contract = web3.eth.contract(abi).at(contractAddress);
        }
        catch(exception)
        {
            alert("contract failed to load, error: " + exception);
        }
    }

    function signAction()
    {
        let account = web3.eth.coinbase;
        console.log("Here is the account: " + account);
        let message = $("#messageBox").val();
        console.log("message to sign: " + message);
        web3Handler.sign(web3, account, message, (err, data) =>
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

    $("#etherScanURLButton").click(() =>
    {
        let contractAddress = $("#contractAddress").val().trim();
        web3Handler.redirectToEtherscan(contractAddress);
    });

    $("#submit").click(() =>
    {
        let abi = $("#ABI").val().trim();
        let contractAddress = $("#contractAddress").val().trim();
        window.location.href = "/api/" + abi + "/" + contractAddress;
    });

    $("#balanceBox").click(() => {
        let abi = $("#ABI").val().trim();
        let contractAddress = $("#contractAddress").val().trim();
        let contract = web3.eth.contract(abi).at(contractAddress);
        
    });

    //this is needed because function buttons are created on the fly so we cannot know in advance their elements
    $(':button').not("#signButton" , "#etherScanURLButton", "#submit", "#balanceBox").click((e) =>
    {
        console.log("button clicked: " + e.target.id);
        //TODO find out why js doesn't ignore verifyButton in not jquery
        if(e.target.id == "verifyButton")
        {
            verifyAction();
            return;
        }
        let contractAddress = $("#contractAddress").val().trim();
        let abi = $("#ABI").val().trim();
        if(!web3Handler.checkAddressValidity(web3, contractAddress))
        {
            alert("missing or invalid contract address: " + contractAddress);
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
