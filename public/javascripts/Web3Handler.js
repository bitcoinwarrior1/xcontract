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

    executeContractFunction : (functionName, contractAddress, params, contract) =>
    {
         //must use bracket notation as function name is passed as a string
         web3.eth[functionName].sendTransaction(params, {to:contractAddress, from:eth.coinbase});
    },

    sendEtherToContract : (value, contractAddress) =>
    {
         web3.eth.sendTransaction({to: contractAddress, from: eth.coinbase, value: value });
    }

};
