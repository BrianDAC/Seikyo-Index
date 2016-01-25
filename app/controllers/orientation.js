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


// ORIENTATION
router.post("/:seikyo/orientations", function (req, res, next) {
    var orientation = new Orientation(req.body);
    req.seikyo.orientation.push(orientation._id);

    async.parallel({
        orientation: function (callback) {
            orientation.save(function (err, orientation) {
                callback(err, orientation)
            })
        },
        seikyo: function (callback) {
            req.seikyo.save(function (err, seikyo) {
                callback(err, seikyo)
            })
        }
    },function (err, results) {
        if (err) return next(common.catchUnhandledErrors(err));
        res.json(orientation);
    });
})

router.get("/orientations", function (req, res, next) {
    Orientation.find()
    .populate('seikyo')
    .exec(function (err, orientations) {
        if (err) return next(common.catchUnhandledErrors(err));
        res.json(orientations)
    })
})

router.delete("/:seikyo/orientations/:orientation", function (req, res, next) {
    req.seikyo.orientation.splice(req.body.index, 1);
    async.parallel({
        orientation: function (callback) {
            req.orientation.remove(function (err, orientation) {
                callback(err, orientation)
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

router.put("/:seikyo/orientations/:orientation", function (req, res, next) {
    common.setModelValues(req.body, req.orientation)
    req.orientation.save(function (err, orientation) {
        if (err) return next(common.catchUnhandledErrors(err));
        res.json(orientation)
    })
})

// ORIENTATION PARAMS
router.param('orientation', function (req, res, next, value) {
    Orientation.findById(value).exec(function (err, orientation) {
        if (err) return next(err);
        if (!orientation) return next({
        message: 'OrientationNotFound',
        status: 400
        });
        req.orientation = orientation;
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