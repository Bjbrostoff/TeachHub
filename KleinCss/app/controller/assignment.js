/**
 * Created by Administrator on 2016/1/4.
 */

var async = require('async');

var courseDBModel = require('../model/course');
var courseMod = new courseDBModel.Schema('course').model;

var calnodeDBModel = require('../model/calnode');
var calnodeMod = new calnodeDBModel.Schema('calnode').model;

var ucrelDBModel = require('../model/ucrel');
var ucrelMod = new ucrelDBModel.Schema('ucrel').model;

var userDBModel = require('../model/user');
var userMod = new userDBModel.Schema('user').model;

exports.homeRightImage = function (req, res) {
    var userid = req.session.user.userid;
    var date=new Date();
    var yyyy=date.getFullYear().toString();
    var mm=(date.getMonth()+1).toString();
    if(mm.length==1){mm='0'+mm}
    var dd=date.getDate().toString();
    if(dd.length==1){dd='0'+dd}
    var hh=date.getHours().toString();
    if(hh.length==1){hh='0'+hh}
    var m=date.getMinutes().toString();
    if(m.length==1){m='0'+m}
    var endDate=yyyy+'-'+mm+'-'+dd+' '+hh+':'+m+':'+'00';
    var series = ['image', 'arrange'];
    var result = {};

    async.eachSeries(
        series,
        function (item, callback) {
            switch (item) {
                case 'image':
                    userMod.find({
                            _id:userid
                        },
                        'portrait -_id',
                        function (err, list) {
                            if (err) {
                                result = {
                                    state: false,
                                    data: null,
                                };
                                callback();
                            }
                            else {
                                result = {
                                    state: true,
                                    data: list[0],
                                };
                                callback();

                            }
                        });
                    break;
                case 'arrange':
                    if (result.state) {
                        calnodeMod.find({
                                teacherid: userid,
                                tdate: {
                                    $gte: endDate
                                }
                            }, {tdate: 1,address:1, name: 1, _id: 0})
                            .sort({'tdate':'asc'})
                            .populate(
                                {
                                    path: 'course',
                                    select: '_id name'
                                })
                            .exec(function (err, list) {
                                if (err) {
                                    result.state = false;
                                    result.end = null;
                                    callback();
                                }
                                else {
                                    result.state = true;
                                    result.end = list;
                                    callback();
                                }
                            });
                    }
                    else {
                        result = {
                            state: false,
                            end: null
                        };
                        callback();
                    }
                    break;

            }
        },
        function (err) {
            if (err) {
                res.json({
                    imgUrl:result.data.portrait,
                    next:null
                })
            } else {
                res.json({
                    imgUrl:result.data.portrait,
                    next:result.end[0]
                })
            }
        });
}