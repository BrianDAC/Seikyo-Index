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


// FEMENINEDIVISION
router.post("/:seikyo/femenineDivisions", function (req, res, next) {
    var femenineDivision = new FemenineDivision(req.body);
    req.seikyo.femenineDivision.push(femenineDivision._id);

    async.parallel({
        femenineDivision: function (callback) {
            femenineDivision.save(function (err, femenineDivision) {
                callback(err, femenineDivision)
            })
        },
        seikyo: function (callback) {
            req.seikyo.save(function (err, seikyo) {
                callback(err, seikyo)
            })
        }
    },function (err, results) {
        if (err) return next(common.catchUnhandledErrors(err));
        res.json(femenineDivision);
    });
})

router.get("/femenineDivisions", function (req, res, next) {
    FemenineDivision.find()
    .populate('seikyo')
    .exec(function (err, femenineDivisions) {
        if (err) return next(common.catchUnhandledErrors(err));
        res.json(femenineDivisions)
    })
})

router.delete("/:seikyo/femenineDivisions/:femenineDivision", function (req, res, next) {
    req.seikyo.femenineDivision.splice(req.body.index, 1);
    async.parallel({
        femenineDivision: function (callback) {
            req.femenineDivision.remove(function (err, femenineDivision) {
                callback(err, femenineDivision)
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

router.put("/:seikyo/femenineDivision/:femenineDivision", function (req, res, next) {
    common.setModelValues(req.body, req.femenineDivision)
    req.femenineDivision.save(function (err, femenineDivision) {
        if (err) return next(common.catchUnhandledErrors(err));
        res.json(femenineDivision)
    })
})

// FEMENINEDIVISION PARAMS
router.param('femenineDivision', function (req, res, next, value) {
    FemenineDivision.findById(value).exec(function (err, femenineDivision) {
        if (err) return next(err);
        if (!femenineDivision) return next({
        message: 'FemenineDivisionNotFound',
        status: 400
        });
        req.femenineDivision = femenineDivision;
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