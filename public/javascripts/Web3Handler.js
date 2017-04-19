//web3.js requirements
let Web3 = require('web3');
let web3 = new Web3();
let provider = "https://rawtestrpc.metamask.io/" || "http://localhost:8545/";
//init web3 provider
web3.setProvider(new web3.providers.HttpProvider(provider));

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

    getContract : (abi, address, provider) =>
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

    executeFunction : (functionItself, params) =>
    {
         functionItself(params);
    },

    sendEtherToContract : (value, contractAddress) =>
    {
         web3.eth.sendTransaction({to: contractAddress, from: eth.coinbase, value: value });
    }

};
