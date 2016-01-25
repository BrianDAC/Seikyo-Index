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


// MONTHLYPHRASE
router.post("/:seikyo/monthlyPhrases", function (req, res, next) {
    var monthlyPhrase = new MonthlyPhrase(req.body);
    req.seikyo.monthlyPhrase.push(monthlyPhrase._id);

    async.parallel({
        monthlyPhrase: function (callback) {
            monthlyPhrase.save(function (err, monthlyPhrase) {
                callback(err, monthlyPhrase)
            })
        },
        seikyo: function (callback) {
            req.seikyo.save(function (err, seikyo) {
                callback(err, seikyo)
            })
        }
    },function (err, results) {
        if (err) return next(common.catchUnhandledErrors(err));
        res.json(monthlyPhrase);
    });
})

router.get("/monthlyPhrases", function (req, res, next) {
    MonthlyPhrase.find()
    .populate('seikyo')
    .exec(function (err, monthlyPhrases) {
        if (err) return next(common.catchUnhandledErrors(err));
        res.json(monthlyPhrases)
    })
})

router.delete("/:seikyo/monthlyPhrases/:monthlyPhrase", function (req, res, next) {
    req.seikyo.monthlyPhrase.splice(req.body.index, 1);
    async.parallel({
        monthlyPhrase: function (callback) {
            req.monthlyPhrase.remove(function (err, monthlyPhrase) {
                callback(err, monthlyPhrase)
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

router.put("/:seikyo/monthlyPhrases/:monthlyPhrase", function (req, res, next) {
    common.setModelValues(req.body, req.monthlyPhrase)
    req.monthlyPhrase.save(function (err, monthlyPhrase) {
        if (err) return next(common.catchUnhandledErrors(err));
        res.json(monthlyPhrase)
    })
})

// MONTHLYPHRASE PARAMS
router.param('monthlyPhrase', function (req, res, next, value) {
    MonthlyPhrase.findById(value).exec(function (err, monthlyPhrase) {
        if (err) return next(err);
        if (!monthlyPhrase) return next({
        message: 'MonthlyPhraseNotFound',
        status: 400
        });
        req.monthlyPhrase = monthlyPhrase;
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