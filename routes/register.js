let express = require('express');
let router = express.Router();
let knexConfig = require('../knex/knexfile');
let knex = require('knex')(knexConfig[process.env.NODE_ENV || "development"]);
let web3Handler = require("../public/javascripts/Web3Handler.js");

router.get("/register", (req, res, next) => {
    res.render('register', {
        // status:"Register your dApp by filling out the form below"
    });
});

router.get("/register/:error", (req,res,next) => {
    let error = req.params.error;
    res.render('register', {
        status: "Error registering dApp: " + error
    });
});

//on submit
router.get('/register/:dappname/:contractaddress', (req,res,next) =>
{
    let dappName = req.params.dappname;
    let contractAddress = req.params.contractaddress;

    //web3Handler.checkContractValidity(res,contractAddress, abi);

    web3Handler.checkIfContractIsVerified(contractAddress, (err,data) => {
        if(data.body.message !== "NOTOK")
        {
            //verified
            let abi = data.body.result;
            knex.table("dapptable").insert({dappname: dappName, contractaddress:contractAddress})
            .then((data) => {
                console.log(data);
                res.render('register', {
                    status:"dApp registration successful"
                });
            })
            .catch((err) =>
            {
                console.log(err.message);
                if(err.message.includes("SQLITE_CONSTRAINT: UNIQUE"))
                {
                    res.render('register', {
                        status:"dApp already registered"
                    });
                }
                else throw err;
            });
        }
        else
        {
            res.render('register', {
                status: "dApp source code is not verified on etherscan, please verify it then try again"
            })
        }
    });

});

module.exports = router;
