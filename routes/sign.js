let express = require('express');
let router = express.Router();

router.get("/sign", (req, res, next) => {
    res.render('sign', {

    });
});

module.exports = router;
