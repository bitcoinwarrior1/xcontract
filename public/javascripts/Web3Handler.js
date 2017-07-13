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

        for(abiFunc of abiFunctions)
        {
            let functionName = abiFunc.name;
            let functionParams = [];

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
            }
        }

        nameAndParamObj.names = functionNameFields;
        nameAndParamObj.params = functionParamFields;
        nameAndParamObj.readOnly = readOnlyParamInputs;

        return nameAndParamObj;
    },

    executeContractFunction : (contract, functionName, params) =>
    {
         //must use bracket notation as function name is passed as a string
         if(params == null)
         {
             contract[functionName]( (err, data) =>
             {
                 if(err) throw err;
             });
         }
         else
         {
             contract[functionName](params, (err, data) =>
             {
                 if(err) throw err;
             });
         }
    },

    callContractFunction : (contract, functionName, params, callback) =>
    {
        //must use bracket notation as function name is passed as a string
        if(params == null)
        {
            contract.call()[functionName]( (err, data) =>
            {
                if(err)
                {
                    callback(false);
                    throw err;
                }
                alert("here is the response from web3: " + data);
                callback(true);
            });
        }
        else
        {
            contract.call()[functionName](params, (err, data) =>
            {
                if(err)
                {
                    callback(false);
                    throw err;
                }
                alert("here is the response from web3: " + data);
                callback(true);
            });
        }
    },

    checkAddressValidity : (address) =>
    {
        return web3.isAddress(address);
    }
};