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


// MASCULINEDIVISION
router.post("/:seikyo/masculineDivisions", function (req, res, next) {
    var masculineDivision = new MasculineDivision(req.body);
    req.seikyo.masculineDivision.push(masculineDivision._id);

    async.parallel({
        masculineDivision: function (callback) {
            masculineDivision.save(function (err, masculineDivision) {
                callback(err, masculineDivision)
            })
        },
        seikyo: function (callback) {
            req.seikyo.save(function (err, seikyo) {
                callback(err, seikyo)
            })
        }
    },function (err, results) {
        if (err) return next(common.catchUnhandledErrors(err));
        res.json(masculineDivision);
    });
})

router.get("/masculineDivisions", function (req, res, next) {
    MasculineDivision.find()
    .populate('seikyo')
    .exec(function (err, masculineDivisions) {
        if (err) return next(common.catchUnhandledErrors(err));
        res.json(masculineDivisions)
    })
})

router.delete("/:seikyo/masculineDivisions/:masculineDivision", function (req, res, next) {
    req.seikyo.masculineDivision.splice(req.body.index, 1);
    async.parallel({
        masculineDivision: function (callback) {
            req.masculineDivision.remove(function (err, masculineDivision) {
                callback(err, masculineDivision)
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

router.put("/:seikyo/masculineDivision/:masculineDivisions", function (req, res, next) {
    common.setModelValues(req.body, req.masculineDivisions)
    req.masculineDivisions.save(function (err, masculineDivisions) {
        if (err) return next(common.catchUnhandledErrors(err));
        res.json(masculineDivisions)
    })
})

// MASCULINEDIVISION PARAMS
router.param('masculineDivision', function (req, res, next, value) {
    MasculineDivision.findById(value).exec(function (err, masculineDivision) {
        if (err) return next(err);
        if (!masculineDivision) return next({
        message: 'MasculineDivisionNotFound',
        status: 400
        });
        req.masculineDivision = masculineDivision;
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