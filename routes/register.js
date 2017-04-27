//Globals:
let express = require('express');
let router = express.Router();
let knex = require("knex");

router.get("/register", (req, res, next) =>
{
    res.render('register', {

    });
});

//on submit
router.get('register/:dAppName/:abi/:contractAddress', (req,res,next) =>
{
    let dappName = req.param.dAppName;
    let abi = req.param.abi;
    let contractAddress = req.param.contractAddress;

    knex.table("dAppTable").insert({dappName: dappName, abi:abi, contractAddress:contractAddress})
        .then((err, data) => {
            console.log(data);
            res.render('register', {

            });
        });
});
