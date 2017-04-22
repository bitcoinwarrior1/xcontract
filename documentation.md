#DOCUMENTATION

##API

###HTTP GET '/api/:abi/:address'
This function routes to the index page and allows an abi and contract address to be parsed into a web3.js contract instance.

### function extractAbiFunctions
Returns an array of functions extracted from the ABI JSON 

###function executeContractFunction (contract, functionName, params) 
Dynamically creates a web3 transaction which triggers a specific function.



