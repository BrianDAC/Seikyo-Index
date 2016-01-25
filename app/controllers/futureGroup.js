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


/// FUTUREGROUP
router.post("/:seikyo/futureGroups", function (req, res, next) {
    var futureGroup = new FutureGroup(req.body);
    req.seikyo.futureGroup.push(futureGroup._id);

    async.parallel({
        futureGroup: function (callback) {
            futureGroup.save(function (err, futureGroup) {
                callback(err, futureGroup)
            })
        },
        seikyo: function (callback) {
            req.seikyo.save(function (err, seikyo) {
                callback(err, seikyo)
            })
        }
    },function (err, results) {
        if (err) return next(common.catchUnhandledErrors(err));
        res.json(futureGroup);
    });
})

router.get("/futureGroups", function (req, res, next) {
    FutureGroup.find()
    .populate('seikyo')
    .exec(function (err, futureGroups) {
        if (err) return next(common.catchUnhandledErrors(err));
        res.json(futureGroups)
    })
})

router.delete("/:seikyo/futureGroups/:futureGroup", function (req, res, next) {
    req.seikyo.futureGroup.splice(req.body.index, 1);
    async.parallel({
        futureGroup: function (callback) {
            req.futureGroup.remove(function (err, futureGroup) {
                callback(err, futureGroup)
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

router.put("/:seikyo/futureGroups/:futureGroup", function (req, res, next) {
    common.setModelValues(req.body, req.futureGroup)
    req.futureGroup.save(function (err, futureGroup) {
        if (err) return next(common.catchUnhandledErrors(err));
        res.json(futureGroup)
    })
})

// FUTUREGROUP PARAMS
router.param('futureGroup', function (req, res, next, value) {
    FutureGroup.findById(value).exec(function (err, futureGroup) {
        if (err) return next(err);
        if (!futureGroup) return next({
        message: 'FutureGroupNotFound',
        status: 400
        });
        req.futureGroup = futureGroup;
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