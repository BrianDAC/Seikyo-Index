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


// SOKAADVANCE
router.post("/:seikyo/sokaAdvances", function (req, res, next) {
    var sokaAdvance = new SokaAdvance(req.body);
    req.seikyo.sokaAdvance.push(sokaAdvance._id);

    async.parallel({
        sokaAdvance: function (callback) {
            sokaAdvance.save(function (err, sokaAdvance) {
                callback(err, sokaAdvance)
            })
        },
        seikyo: function (callback) {
            req.seikyo.save(function (err, seikyo) {
                callback(err, seikyo)
            })
        }
    },function (err, results) {
        if (err) return next(common.catchUnhandledErrors(err));
        res.json(sokaAdvance);
    });
})

router.get("/sokaAdvances", function (req, res, next) {
    console.log('hi')
    SokaAdvance.find()
    .populate('seikyo')
    .exec(function (err, sokaAdvances) {
        if (err) return next(common.catchUnhandledErrors(err));
        res.json(sokaAdvances)
    })
})

router.delete("/:seikyo/sokaAdvances/:sokaAdvance", function (req, res, next) {
    req.seikyo.sokaAdvance.splice(req.body.index, 1);
    async.parallel({
        sokaAdvance: function (callback) {
            req.sokaAdvance.remove(function (err, sokaAdvance) {
                callback(err, sokaAdvance)
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

router.put("/:seikyo/sokaAdvances/:sokaAdvance", function (req, res, next) {
    common.setModelValues(req.body, req.sokaAdvance)
    req.sokaAdvance.save(function (err, sokaAdvance) {
        if (err) return next(common.catchUnhandledErrors(err));
        res.json(sokaAdvance)
    })
})

// SOKAADVANCE PARAMS
router.param('sokaAdvance', function (req, res, next, value) {
    SokaAdvance.findById(value).exec(function (err, sokaAdvance) {
        if (err) return next(err);
        if (!sokaAdvance) return next({
        message: 'SokaAdvanceNotFound',
        status: 400
        });
        req.sokaAdvance = sokaAdvance;
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