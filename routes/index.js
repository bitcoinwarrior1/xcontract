let express = require('express');
let router = express.Router();
let web3Handler = require("../public/javascripts/Web3Handler.js");

/* GET home page. */
router.get('/', (req, res, next) => {
    res.render('index', { title: 'xcontract' });
});

router.get("/api/:contractAddress", (req,res,next) => {

    //TODO should not display if not mainnet
    let contractAddress = req.params.contractAddress;
    let etherscanURL = "https://etherscan.io/address/" + contractAddress;

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
router.get('/api/:abi/:address', (req,res,next) => {

    //parameters
    let abi = req.params.abi;
    let contractAddress = req.params.address;
    let abiJson = JSON.parse(abi);
    let abiFunctions = web3Handler.extractAbiFunctions(abiJson);
    //function and param names
    let functionNameAndParamObj = web3Handler.getContractFunctionNamesAndParams(abiFunctions);
    //sets up function calls to contract from UI
    //TODO should not display if not mainnet
    let etherscanURL = "https://etherscan.io/address/" + contractAddress;

    web3Handler.checkIfContractIsVerified(contractAddress, (error, data) =>
    {
        if(data.body.message === "NOTOK")
        {
            res.render('index', {
                abiVal: JSON.stringify(abiJson),
                addressVal: contractAddress,
                functionNames: functionNameAndParamObj.names,
                functionParams : functionNameAndParamObj.params,
                functionTitle:"Smart Contract Functions",
                warning:"Warning! Contract source code is not verified on etherscan!",
                readOnlyAttribute: functionNameAndParamObj.readOnly,
                etherscanURL : etherscanURL
            });
        }
        else
        {
            res.render('index', {
                abiVal: JSON.stringify(abiJson),
                addressVal: contractAddress,
                functionNames: functionNameAndParamObj.names,
                functionParams : functionNameAndParamObj.params,
                functionTitle:"Smart Contract Functions",
                warning:"Contract source code is verified on etherscan!",
                readOnlyAttribute: functionNameAndParamObj.readOnly,
                etherscanURL : etherscanURL
            });
        }
    });

});


module.exports = router;
