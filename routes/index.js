//TODO fix exporting issue with search and register routes

//Globals:
let express = require('express');
let router = express.Router();
let web3Handler = require("../public/javascripts/Web3Handler.js");
let request = require("superagent");
let knexConfig = require('../knex/knexfile');
let knex = require('knex')(knexConfig[process.env.NODE_ENV || "development"]);

/* GET home page. */
router.get('/', (req, res, next) => {
    res.render('index', { title: 'xcontract' });
});

router.get("/api/:contractAddress", (req,res,next) => {

    let contractAddress = req.params.contractAddress;
    checkIfContractIsVerified(contractAddress, (err, data) =>
    {
        if(data.body.message === "NOTOK")
        {
            res.render('index', {
                abiError: "PLEASE PASTE ABI HERE",
                addressVal: contractAddress,
                functionTitle:"Smart Contract Functions",
                warning:"NO ABI FOUND AS CONTRACT IS NOT VERIFIED ON ETHERSCAN"
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

    checkIfContractIsVerified(contractAddress, (error, data) =>
    {
        if(data.body.message === "NOTOK")
        {
            res.render('index', {
                abiVal: JSON.stringify(abiJson),
                addressVal: contractAddress,
                functionNames: functionNameAndParamObj.names,
                functionParams : functionNameAndParamObj.params,
                functionTitle:"Smart Contract Functions",
                warning:"Warning! Contract source code is not verified on etherscan!"
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
                warning:"Contract source code is verified on etherscan!"
            });
        }
    });

});

function checkIfContractIsVerified(contractAddress, cb)
{
    let etherScanApi = "http://api.etherscan.io/api?module=contract&action=getabi&address=";

    request.get(etherScanApi + contractAddress, (error, data) =>
    {
        if(error)
        {
            cb(error, null);
            throw error;
        }
        else
        {
            cb(null, data);
        }
    });
}

router.get("/search/", (req,res,next) =>
{
    res.render('search', {
        // searchResult: "Welcome to search"
    });
});

router.get("/search/:dappname", (req,res,next) =>
{
    let arrayOfResultObjects = [];
    let dappName = req.params.dappname;

    knex("dAppTable").select().where("dAppName" , "%" + dappName + "%").then( (err,data) => {
        if(err) throw err;

        for(result of data)
        {
            let resultObj = {};
            resultObj.dAppName = data.dAppName;
            resultObj.abi = data.abi;
            resultObj.contractAddress = data.contractAddress;

            arrayOfResultObjects.push(resultObj);
        }
    });

    //render all the items in a seperate div for each
    res.render('search', {
        searchResult : arrayOfResultObjects
    });
});

router.get("/register/", (req, res, next) =>
{
    res.render('register', {
        // status:"Register your dApp by filling out the form below"
    });
});

router.get("/register/:error", (req,res,next) => {
    let error = req.param.error;

    res.render('register', {
        status: "Error registering dApp: " + error
    });
});

//on submit
router.get('/register/:dAppName/:abi/:contractAddress', (req,res,next) =>
{
    let dappName = req.param.dAppName;
    let abi = req.param.abi;
    let contractAddress = req.param.contractAddress;

    if(contractAddress.length != 42)
        res.redirect("/register/invalid contract address");
    else if(abi == "")
        res.redirect("/register/invalid/no abi provided");


    knex.table("dAppTable").insert({dAppName: dappName, abi:abi, contractAddress:contractAddress})
        .then((err, data) => {
            console.log(data);
            res.render('register', {
                status:"dApp registration successful"
            });
        });
});


module.exports = router;
