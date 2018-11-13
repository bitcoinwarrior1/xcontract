let request = require("superagent");
let utils = require("ethereumjs-util");

module.exports = {

    //TODO support other networks
    checkIfContractIsVerified : (contractAddress, cb) =>
    {
        let etherScanApi = "http://api.etherscan.io/api?module=contract&action=getabi&address=";

        request.get(etherScanApi + contractAddress, (error, data) =>
        {
            if(error)
            {
                cb(error, null);
                throw error;
            }
            else
            {
                cb(null, data);
            }
        });
    },

    extractAbiFunctions : (abi) =>
    {
        let arrayOfFunctionObjects = [];

        for(let i = 0; i < abi.length; i++)
        {
            if(abi[i].type == "function")
            {
                // console.log("here is each function from abi: " + JSON.stringify(abi[i]));
                arrayOfFunctionObjects.push(abi[i]);
            }
        }
        return arrayOfFunctionObjects;
    },

    getContractFunctionNamesAndParams : (abiFunctions) =>
    {
        let nameAndParamObj = {};
        let functionNameFields = [];
        let functionParamFields = [];
        let readOnlyParamInputs = [];
        //for each function
        for(let abiFunc of abiFunctions)
        {
            let functionName = abiFunc.name;
            let functionParams = [];
            //for each specific function parameters
            for(let input of abiFunc.inputs) functionParams.push(JSON.stringify(input));

            //create jade elements for each function with name and param
            functionNameFields.push(functionName);
            functionParamFields.push(functionParams);

            //if there are no params then set the input to readonly
            if(functionParams.length == 0)
            {
                readOnlyParamInputs.push(true);
            }
            else
            {
                readOnlyParamInputs.push(false);
                //add ability to attach ether to transaction
                if(JSON.stringify(abiFunc).includes('"payable":true'))
                {
                    functionParams.push('{"name" : Optional_Ether_Amount, "type": uint256}');
                }
            }
        }
        nameAndParamObj.names = functionNameFields;
        nameAndParamObj.params = functionParamFields;
        nameAndParamObj.readOnly = readOnlyParamInputs;

        console.log(functionParamFields);

        return nameAndParamObj;
    },

    executeContractFunction : (contract, txObj, cb) =>
    {
        let etherValue = 0;
        if(txObj.filledOutParams != null)
        {
            if(txObj.isPayable)
            {
                //last element is ether value
                etherValue = parseInt(txObj.filledOutParams[txObj.filledOutParams.length - 1]);
                txObj.filledOutParams.pop();
                //TODO clean up logic
                txObj.push({ value: etherValue });
            }
            contract[txObj.functionCalled](txObj.filledOutParams, (err, data) =>
            {
                if(err) throw err;
                cb(data)
            });
        }
        else
        {
            contract[txObj.functionCalled]( (err, data) =>
            {
                if(err) throw err;
                cb(data)
            });
        }

    },

    checkAddressValidity : (web3, address) =>
    {
        return web3.isAddress(address);
    },

    signMessage : (web3, account, message, cb) =>
    {
        try
        {
            web3.eth.sign(account, message, (err, data) => {
                cb(err, data);
            });
        }
        catch(e)
        {
            console.log("signing error: " + e);
        }
    },

    verify: (web3, message, signature, cb) =>
    {
        try
        {
            message = web3.sha3(message);
            const {v, r, s} = utils.fromRpcSig(signature);
            let m = utils.toBuffer(message);
            let pub = utils.ecrecover(m, v, r, s);
            let adr = '0x' + utils.pubToAddress(pub).toString('hex');
            cb(adr);
        }
        catch(e)
        {
            console.log("verify error: " + e);
        }
    },

    redirectToEtherscan : (web3, address) =>
    {
        web3.version.getNetwork((err, networkId) => {
            if (networkId == 3) window.location.href = "https://ropsten.etherscan.io/address/" + address;
            else if (networkId == 4) window.location.href = "https://rinkeby.etherscan.io/address/" + address;
            else if (networkId == 42) window.location.href = "https://kovan.etherscan.io/address/" + address;
            else window.location.href = "https://etherscan.io/address/" + address;
        });
    }
};
