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


// ADVERTISING
router.post("/:seikyo/advertisings", function (req, res, next) {
    var advertising = new Advertising(req.body);
    req.seikyo.advertising.push(advertising._id);

    async.parallel({
        advertising: function (callback) {
            advertising.save(function (err, advertising) {
                callback(err, advertising)
            })
        },
        seikyo: function (callback) {
            req.seikyo.save(function (err, seikyo) {
                callback(err, seikyo)
            })
        }
    },function (err, results) {
        if (err) return next(common.catchUnhandledErrors(err));
        res.json(advertising);
    });
})

router.get("/advertisings", function (req, res, next) {
    Advertising.find()
    .populate('seikyo')
    .exec(function (err, advertisings) {
        if (err) return next(common.catchUnhandledErrors(err));
        res.json(advertisings)
    })
})

router.delete("/:seikyo/advertisings/:advertising", function (req, res, next) {
    req.seikyo.advertising.splice(req.body.index, 1);
    async.parallel({
        advertising: function (callback) {
            req.advertising.remove(function (err, advertising) {
                callback(err, advertising)
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

router.put("/:seikyo/advertisings/:advertising", function (req, res, next) {
    common.setModelValues(req.body, req.advertising)
    req.advertising.save(function (err, advertising) {
        if (err) return next(common.catchUnhandledErrors(err));
        res.json(advertising)
    })
})

// ADVERTISING PARAMS
router.param('advertising', function (req, res, next, value) {
    Advertising.findById(value).exec(function (err, advertising) {
        if (err) return next(err);
        if (!advertising) return next({
        message: 'AdvertisingNotFound',
        status: 400
        });
        req.advertising = advertising;
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