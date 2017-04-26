#DOCUMENTATION

##API

###HTTP GET '/api/:address'
This function routes to the index page and retrieves the contract abi from the contract address provided in the URL param.

### function extractAbiFunctions
Returns an array of functions extracted from the ABI JSON 

###function executeContractFunction (contract, functionName, params) 
Dynamically creates a web3 transaction which triggers a specific function.



