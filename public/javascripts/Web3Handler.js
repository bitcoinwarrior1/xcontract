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

    executeContractFunction : (contract, functionName, params) =>
    {
         //must use bracket notation as function name is passed as a string
         if(params == null)
         {
             contract[functionName](function(err, data)
             {
                 if(err) console.log("error: " + err);
                 else console.log("here is the response from web3: " + data);
             });
         }
         else
         {
             contract[functionName](params, function(err, data)
             {
                 if(err) console.log("error: " + err);
                 else console.log("here is the response from web3: " + data);
             });
         }
    },

    sendEtherToContract : (value, contractAddress, web3) =>
    {
         web3.eth.sendTransaction({to: contractAddress, from: eth.coinbase, value: value });
    }

};
