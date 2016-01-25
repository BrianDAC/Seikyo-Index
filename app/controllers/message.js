var mongoose = require('mongoose'),
    router = require('express').Router(),
    common = require('../common'),
    jwt = require('jsonwebtoken'),
    _ = require('lodash'),
    middlewares = require('../common/middlewares'),
    config = require('../../config/config'),
    async = require('async'),
    Seikyo = mongoose.model('Seikyo'),
    Advertising = mongoose.model('Advertising'),
    Article = mongoose.model('Article'),
    BasicTerm = mongoose.model('BasicTerm'),
    Editorial = mongoose.model('Editorial'),
    Experience = mongoose.model('Experience'),
    FemenineDivision = mongoose.model('FemenineDivision'),
    FutureGroup = mongoose.model('FutureGroup'),
    MasculineDivision = mongoose.model('MasculineDivision'),
    Message = mongoose.model('Message'),
    MonthlyPhrase = mongoose.model('MonthlyPhrase'),
    Orientation = mongoose.model('Orientation'),
    Review = mongoose.model('Review'),
    SokaAdvance = mongoose.model('SokaAdvance'),
    StudentGroup = mongoose.model('StudentGroup');

module.exports = function (app) {
    app.use('/api/seikyos', router);
};


// MESSAGE
router.post("/:seikyo/messages", function (req, res, next) {
    var message = new Message(req.body);
    req.seikyo.message.push(message._id);

    async.parallel({
        message: function (callback) {
            message.save(function (err, message) {
                callback(err, message)
            })
        },
        seikyo: function (callback) {
            req.seikyo.save(function (err, seikyo) {
                callback(err, seikyo)
            })
        }
    },function (err, results) {
        if (err) return next(common.catchUnhandledErrors(err));
        res.json(message);
    });
})

router.get("/messages", function (req, res, next) {
    Message.find()
    .populate('seikyo')
    .exec(function (err, messages) {
        if (err) return next(common.catchUnhandledErrors(err));
        res.json(messages)
    })
})

router.delete("/:seikyo/messages/:message", function (req, res, next) {
    req.seikyo.message.splice(req.body.index, 1);
    async.parallel({
        message: function (callback) {
            req.message.remove(function (err, message) {
                callback(err, message)
            })
        },
        seikyo: function (callback) {
            req.seikyo.save(function (err, seikyo) {
                callback(err, seikyo)
            })
        }
    },function (err, results) {
        if (err) return next(common.catchUnhandledErrors(err));
        res.json(req.seikyo);
    });
})

router.put("/:seikyo/messages/:message", function (req, res, next) {
    common.setModelValues(req.body, req.message)
    req.message.save(function (err, message) {
        if (err) return next(common.catchUnhandledErrors(err));
        res.json(message)
    })
})

// MESSAGE PARAMS
router.param('message', function (req, res, next, value) {
    Message.findById(value).exec(function (err, message) {
        if (err) return next(err);
        if (!message) return next({
        message: 'MessageNotFound',
        status: 400
        });
        req.message = message;
        next();
    })
})

// SEIKYO PARAMS
router.param('seikyo', function (req, res, next, value) {
    Seikyo.findById(value)
    .populate('advertising')
    .populate('article')
    .populate('basicTerm')
    .populate('editorial')
    .populate('experience')
    .populate('femenineDivision')
    .populate('futureGroup')
    .populate('masculineDivision')
    .populate('message')
    .populate('monthlyPhrase')
    .populate('orientation')
    .populate('review')
    .populate('seikyo')
    .populate('sokaAdvance')
    .exec(function (err, seikyo) {
        if (err) return next(err);
        if (!seikyo) return next({
            message: 'SeikyoNotFound',
            status: 400
        });
        req.seikyo = seikyo;
        next();
    })})