#DOCUMENTATION

##API

###HTTP GET '/api/:abi/:address'
This function routes to the index page and allows an abi and contract address to be parsed into a web3.js contract instance.

###HTTP GET /function/:functionInfo/:abi/:address/:filledOutParams"
This http call takes the function name, contract abi, contract address, filled params
and executes it on web3.js. 

### function extractAbiFunctions
Returns the functions given to it from the abi.

###function executeContractFunction
Dynamically creates a web3 transaction which triggers a specific function.




