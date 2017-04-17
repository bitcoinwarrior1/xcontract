//web3.js requirements
let Web3 = require('web3');
let web3 = new Web3();
let provider = "https://rawtestrpc.metamask.io/" || "http://localhost:8545/";

module.exports = {

     extractAbiFunctions : (abi) =>
     {
        let arrayOfFunctionObjects = [];

        for(i=0; i < abi.length; i++)
        {
            console.log("here is each element: " + JSON.stringify(abi[i]));

            if(abi[i].type == "function")
            {
                arrayOfFunctionObjects.push(abi[i]);
            }
        }

        console.log(arrayOfFunctionObjects);

        return arrayOfFunctionObjects;
    },

    getContract : (abi, address) =>
    {
        return web3.eth.contract(abi).at(address);
    },

    createFunctionsFromAbi : (abi) =>
    {
         let functionsInAbi = [];
         for(functionInAbi of abi)
         {
            let newFunction = new Function(functionInAbi);
            functionInAbi.push(newFunction);
         }
         return functionsInAbi;
    }

};
