var mongoose = require('mongoose'),
    common = require('../index'),
    crypto = require('crypto'),
    User = mongoose.model('User'),
    Role = mongoose.model('Role');


exports.user = {
    create: function (req, res, next) {
        var user = new User();

        user.username = req.body.username;
        if (req.body.password) {
            user.password = req.body.password;
        }

        Role.find({name: {$in: req.body.roles || []}}).exec(
            function (err, roles) {
                if (err) return next(common.catchUnhandledErrors(err));
                for (var i = 0; i < roles.length; i++) {
                    user.roles.push(roles[i]._id);
                }

                user.save(function (err, user) {
                    if (err) return next(common.catchUnhandledErrors(err));

                    req.userObject = user;

                    next();
                });
            }
        );
    }
};
