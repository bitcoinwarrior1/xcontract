# DOCUMENTATION

## API

### HTTP GET '/api/:abi/:address'
This function routes to the index page and allows an abi and contract address to be parsed into a web3.js contract instance.

### HTTP GET '/api/:address'
If a contract is verified on etherscan all that is needed is the contract address in the params and the etherscan api will provide the ABI for the contract

### function extractAbiFunctions
Returns an array of functions extracted from the ABI JSON 

### function executeContractFunction (contract, functionName, params) 
Dynamically creates a web3 transaction which triggers a specific function.

### function callContractFunction : (contract, functionName, params, callback)
Issues a call to the contract function rather than a transaction. If transaction is needed then the transaction will be executed

