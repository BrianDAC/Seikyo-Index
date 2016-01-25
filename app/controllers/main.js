var mongoose = require('mongoose'),
    router = require('express').Router(),
    common = require('../common'),
    jwt = require('jsonwebtoken'),
    _ = require('lodash'),
    User = mongoose.model('User'),
    middlewares = require('../common/middlewares'),
    config = require('../../config/config');

module.exports = function (app) {
    app.use('/', router);
};

router.get('/token', function (req, res, next){

    if(!!req.user) {

        User.findOne({_id: req.user._id }).select(
            ['username', 'hash', 'salt', 'iterations', 'roles', 'created'].join(' ')
        )
            .populate('roles')
            .exec(function (err, user) {

                if (err) return next(common.catchUnhandledErrors(err));
                if (!user) return next({message: 'UserNotFound', status: 400});

                user = user.toObject();
                delete user.hash;
                delete user.iterations;
                delete user.salt;
                delete user.password;

                res.json(user);
            });
    }else{
        return next({message: 'TokenNotFound', status: 400});
    }
});

router.post('/token', function (req, res, next) {
    User.findOne({ username: req.body.username}).select(
        ['username', 'hash', 'salt', 'iterations', 'roles', 'created'].join(' ')
    )
        .populate('roles')
        .exec(
        function (err, user) {

            if (err) return next({message: 'UnhandledError', status: 400});
            if (!user) return next({message: 'UserNotFound', status: 400});

            user.encrypt(req.body.password, function (err, hash) {
                if (err) return next(common.catchUnhandledErrors(err));
                if (user.hash != hash) return next({message: 'InvalidUserPassword', status: 401});

                user = user.toObject();
                delete user.hash;
                delete user.iterations;
                delete user.salt;
                delete user.password;

                var toToken = _.clone(user);
                delete toToken.doctor;
                res.json({
                    token: jwt.sign(user, config.key),
                    user: user
                });
            });
        }
    );
});