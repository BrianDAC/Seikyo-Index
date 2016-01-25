var common = require('../app/common');

common.connect();

var Permission = require('mongoose').model('Permission');

exports.up = function(next){

    var permission = new Permission();
    permission.name = 'all';
    permission.method = '*';
    permission.path = '*';
    permission.save(function (err, permission) {
        if (err) return next (err);
        next();
    });

};

exports.down = function(next){

    Permission.findOneAndRemove({ name:'all' }, next);
};
