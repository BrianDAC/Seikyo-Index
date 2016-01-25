var mongoose = require('mongoose'),
    Permission = mongoose.model('Permission'),
    Role = mongoose.model('Role');

exports.up = function(next){

    Permission.findOne({ name:'all' }, function(err, permission){

        var role = new Role();
        role.name = 'root';
        role.permissions.push(permission);

        role.save(function (err, role) {
            if (err) return next (err);
            next();
        })
    });
};

exports.down = function(next){

    Role.findOneAndRemove({name:'root'}, next);
};
