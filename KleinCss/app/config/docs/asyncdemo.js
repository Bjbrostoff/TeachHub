/**
 * Created by apple on 16/1/17.
 */

var async = require('async');

exports.createNewCourse = function(req, res){
    var userid = req.session.user.userid;

    console.log(userid);

    var infos = ['user', 'course'];

    var result = {};
    async.eachSeries(infos, function(item, callback){
        switch (item) {
            case 'user':
                userMod.findOne({_id:userid}, function(err, user){
                    if (err) {
                        console.log(err);
                        result.user = null;
                        callback();
                    }else {
                        result.user = user;
                        callback();
                    }
                });
                break;
            case 'course':
                console.log(result.user);
                break;
        }
    }, function(err){
        if (err){
            res.json({
                state:'fail',
                msg:err
            })
        }else{
            res.json({
                state:'success'
            })
        }
    });

    res.json({
        'state':'error'
    })
}