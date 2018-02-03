let express = require('express');
let router = express.Router();

router.get("/sign", (req, res, next) => {
    res.render('sign', {

    });
});

router.get("/register/:error", (req,res,next) => {
    let error = req.params.error;
    res.render('register', {
        status: "Error registering dApp: " + error
    });
});

module.exports = router;
