let express = require('express');
let router = express.Router();
let web3Handler = require("../public/javascripts/Web3Handler.js");

/* GET home page. */
router.get('/', (req, res, next) => {
    res.render('index', { title: 'xcontract' });
});

router.get("/api/:contractAddress", (req, res, next) => {
    //TODO should not display if not mainnet
    let contractAddress = req.params.contractAddress;
    let networkId = web3Handler.getNetworkId();
    let etherscanURL = web3Handler.getEtherscanURL(networkId) + contractAddress;

    web3Handler.checkIfContractIsVerified(contractAddress, (err, data) =>
    {
        if(data.body.message === "NOTOK")
        {
            res.render('index', {
                abiError: "PLEASE PASTE ABI HERE",
                addressVal: contractAddress,
                functionTitle:"Smart Contract Functions",
                warning:"NO ABI FOUND AS CONTRACT IS NOT VERIFIED ON ETHERSCAN",
                etherscanURL : etherscanURL
            });
        }
        else
        {
            res.redirect('/api/' + data.body.result + "/" + contractAddress);
        }
    });
});

//handle user giving abi in url param
router.get('/api/:abi/:address', (req, res, next) => {

    //parameters
    let abi = req.params.abi;
    let contractAddress = req.params.address;
    let abiJson = JSON.parse(abi);
    let abiFunctions = web3Handler.extractAbiFunctions(abiJson);
    //function and param names
    let functionNameAndParamObj = web3Handler.getContractFunctionNamesAndParams(abiFunctions);
    //sets up function calls to contract from UI
    let networkId = web3Handler.getNetworkId();
    let etherscanURL = web3Handler.getEtherscanURL(networkId) + contractAddress;

    web3Handler.checkIfContractIsVerified(contractAddress, (error, data) =>
    {
        let url = req.protocol + "://" + req.get('host') + req.originalUrl;

        let renderObj = {
            abiVal: JSON.stringify(abiJson),
            addressVal: contractAddress,
            functionNames: functionNameAndParamObj.names,
            functionParams : functionNameAndParamObj.params,
            functionTitle:"Smart Contract Functions",
            readOnlyAttribute: functionNameAndParamObj.readOnly,
            etherscanURL : etherscanURL,
            url: url
        };

        if(data.body.message === "NOTOK")
        {
            renderObj.warning = "Warning! Contract source code is not verified on etherscan!";
            res.render('index', renderObj);
        }
        else
        {
            renderObj.warning = "Contract source code is verified on etherscan!";
            //if verified can give shortened url without abi
            renderObj.url = req.protocol + "://" + req.get('host') + "/api/" + contractAddress;
            res.render('index', renderObj);
        }
    });

});


module.exports = router;
