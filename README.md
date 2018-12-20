# xcontract
A smart contract user interface which allows you to run live smart contracts on an easy to use UI. You can pass the abi and contract address in the URL parameters like below or enter them in the text boxes on the page

#### Website url: https://xcontract.herokuapp.com/

#### Example url call for a contract that is verified on etherscan or has been entered before:
https://xcontract.herokuapp.com/api/0xfb6916095ca1df60bb79ce92ce3ea74c37c5d359

#### Example url call for OpenRep contract: 
https://xcontract.herokuapp.com/api/[%7B"constant":false,"inputs":[%7B"name":"vendor","type":"address"%7D],"name":"trade","outputs":[],"payable":false,"type":"function"%7D,%7B"constant":false,"inputs":[%7B"name":"username","type":"string"%7D,%7B"name":"location","type":"string"%7D],"name":"addUser","outputs":[%7B"name":"","type":"string"%7D],"payable":false,"type":"function"%7D,%7B"constant":false,"inputs":[%7B"name":"vendor","type":"address"%7D,%7B"name":"isPositive","type":"bool"%7D,%7B"name":"message","type":"string"%7D],"name":"giveReputation","outputs":[],"payable":false,"type":"function"%7D,%7B"constant":false,"inputs":[%7B"name":"user","type":"address"%7D],"name":"viewReputation","outputs":[%7B"name":"","type":"uint256"%7D,%7B"name":"","type":"uint256"%7D,%7B"name":"","type":"uint256"%7D,%7B"name":"","type":"uint256"%7D,%7B"name":"","type":"uint256"%7D],"payable":false,"type":"function"%7D,%7B"payable":false,"type":"fallback"%7D,%7B"anonymous":false,"inputs":[%7B"indexed":true,"name":"user","type":"address"%7D,%7B"indexed":true,"name":"message","type":"string"%7D],"name":"_positiveReputation","type":"event"%7D,%7B"anonymous":false,"inputs":[%7B"indexed":true,"name":"user","type":"address"%7D,%7B"indexed":true,"name":"message","type":"string"%7D],"name":"_negativeReputation","type":"event"%7D,%7B"anonymous":false,"inputs":[%7B"indexed":true,"name":"username","type":"string"%7D,%7B"indexed":true,"name":"location","type":"string"%7D,%7B"indexed":true,"name":"user","type":"address"%7D],"name":"_addUser","type":"event"%7D,%7B"anonymous":false,"inputs":[%7B"indexed":true,"name":"vendor","type":"address"%7D,%7B"indexed":true,"name":"buyer","type":"address"%7D],"name":"_newTrade","type":"event"%7D,%7B"anonymous":false,"inputs":[%7B"indexed":true,"name":"user","type":"address"%7D,%7B"indexed":true,"name":"positive","type":"uint256"%7D,%7B"indexed":true,"name":"negative","type":"uint256"%7D,%7B"indexed":false,"name":"total","type":"uint256"%7D,%7B"indexed":false,"name":"burnedEth","type":"uint256"%7D,%7B"indexed":false,"name":"burnedCoins","type":"uint256"%7D],"name":"_viewedReputation","type":"event"%7D]/0x706af303364dc89a6b8dba265947442b05e84776

#### Using other networks (testnet for example)
Install Metamask and select the network or use a custom link for your node


# Donations
If you support the cause, we could certainly use donations to help fund development:

0xbc8dAfeacA658Ae0857C80D8Aa6dE4D487577c63
