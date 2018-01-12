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
                functionParams.push('{"name" : Optional_Ether_Amount, "type": uint256}');
            }
        }
        nameAndParamObj.names = functionNameFields;
        nameAndParamObj.params = functionParamFields;
        nameAndParamObj.readOnly = readOnlyParamInputs;

        console.log(functionParamFields);

        return nameAndParamObj;
    },

    executeContractFunction : (contract, functionName, params, cb) =>
    {
        if(params != null)
        {
            //last element is ether value
            const etherValue = parseInt(params[params.length - 1]);
            console.log("here is the ether value: " + etherValue);
            params.pop();
            contract[functionName](params, {value: etherValue}, (err, data) =>
            {
                if(err) throw err;
                cb(data)
            });
        }
        else
        {
            contract[functionName]( (err, data) =>
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