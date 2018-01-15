let request = require("superagent");
let Web3 = require("web3");
let web3 = new Web3();

module.exports = {

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

        for(i=0; i < abi.length; i++)
        {
            if(abi[i].type == "function")
            {
                // console.log("here is each function from abi: " + JSON.stringify(abi[i]));
                arrayOfFunctionObjects.push(abi[i]);
            }
        }
        return arrayOfFunctionObjects;
    },

    sendEther : (address, value) =>
    {
        return web3.eth.sendTransaction({ to: address, value: value });
    },

    getContractFunctionNamesAndParams : (abiFunctions) =>
    {
        let nameAndParamObj = {};
        let functionNameFields = [];
        let functionParamFields = [];
        let readOnlyParamInputs = [];
        //for each function
        for(abiFunc of abiFunctions)
        {
            let functionName = abiFunc.name;
            let functionParams = [];
            //for each specific function parameters
            for(input of abiFunc.inputs) functionParams.push(JSON.stringify(input));

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
                console.log("here is the ether value: " + etherValue);
                txObj.filledOutParams.pop();
            }

            contract[txObj.functionCalled](txObj.filledOutParams, {value: etherValue}, (err, data) =>
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

    checkAddressValidity : (address) =>
    {
        return web3.isAddress(address);
    }
};