/**
 * Created by apple on 15/12/5.
 */
var dbUrl = require('../config/config').db;
var mongoose = require('mongoose'),
    Admin = mongoose.mongo.Admin;

exports.connect = function(callback) {
    mongoose.connect(dbUrl);
}

exports.mongoObj = function() {
    return mongoose;
}

exports.CreateConnection = function(callback, returnFunc) {
    var connection = mongoose.createConnection(dbUrl);
    connection.on('open', function(){
        callback(connection, Admin, returnFunc);
    })
}