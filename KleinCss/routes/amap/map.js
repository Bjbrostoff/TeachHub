/**
 * Created by apple on 15/12/9.
 */

var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/index', function(req, res, next) {
    res.render('amap/index');
});

module.exports = router;