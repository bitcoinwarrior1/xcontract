/**
 * Created by sangalli on 22/11/18.
 */
let express = require('express');
let router = express.Router();

router.get('/', (req, res, next) => {
    res.render('index_Zh-Hans', { title: 'xcontract' });
});

module.exports = router;
