var mongoose = require('mongoose'),
    Role = mongoose.model('Role'),
    User = mongoose.model('User');

exports.up = function(next){
    Role.findOne({ name:'root' }, function(err, role){

        var user = new User();
        user.username = '';
        user.password = '';
        user.roles.push(role._id);

        user.save(function (err, user) {
            if (err) return next (err);
            next();
        })

    });
};

exports.down = function(next){
    User.findOneAndRemove({ username:''}, next);
};
