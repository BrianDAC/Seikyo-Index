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


// BASICTERM
router.post("/:seikyo/basicTerms", function (req, res, next) {
    var basicTerm = new BasicTerm(req.body);
    req.seikyo.basicTerm.push(basicTerm._id);

    async.parallel({
        basicTerm: function (callback) {
            basicTerm.save(function (err, basicTerm) {
                callback(err, basicTerm)
            })
        },
        seikyo: function (callback) {
            req.seikyo.save(function (err, seikyo) {
                callback(err, seikyo)
            })
        }
    },function (err, results) {
        if (err) return next(common.catchUnhandledErrors(err));
        res.json(basicTerm);
    });
})

router.get("/basicTerms", function (req, res, next) {
    BasicTerm.find()
    .populate('seikyo')
    .exec(function (err, basicTerms) {
        if (err) return next(common.catchUnhandledErrors(err));
        res.json(basicTerms)
    })
})


router.delete("/:seikyo/basicTerms/:basicTerm", function (req, res, next) {
    req.seikyo.basicTerm.splice(req.body.index, 1);
    async.parallel({
        basicTerm: function (callback) {
            req.basicTerm.remove(function (err, basicTerm) {
                callback(err, basicTerm)
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

router.put("/:seikyo/basicTerms/:basicTerm", function (req, res, next) {
    common.setModelValues(req.body, req.basicTerm)
    req.basicTerm.save(function (err, basicTerm) {
        if (err) return next(common.catchUnhandledErrors(err));
        res.json(basicTerm)
    })
})

// BASICTERM PARAMS
router.param('basicTerm', function (req, res, next, value) {
    BasicTerm.findById(value).exec(function (err, basicTerm) {
        if (err) return next(err);
        if (!basicTerm) return next({
        message: 'BasicTermNotFound',
        status: 400
        });
        req.basicTerm = basicTerm;
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