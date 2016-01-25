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


// REVIEW
router.post("/:seikyo/reviews", function (req, res, next) {
    var review = new Review(req.body);
    req.seikyo.review.push(review._id);

    async.parallel({
        review: function (callback) {
            review.save(function (err, review) {
                callback(err, review)
            })
        },
        seikyo: function (callback) {
            req.seikyo.save(function (err, seikyo) {
                callback(err, seikyo)
            })
        }
    },function (err, results) {
        if (err) return next(common.catchUnhandledErrors(err));
        res.json(review);
    });
})

router.get("/reviews", function (req, res, next) {
    Review.find()
    .populate('seikyo')
    .exec(function (err, reviews) {
        if (err) return next(common.catchUnhandledErrors(err));
        res.json(reviews)
    })
})

router.delete("/:seikyo/reviews/:review", function (req, res, next) {
    req.seikyo.review.splice(req.body.index, 1);
    async.parallel({
        review: function (callback) {
            req.review.remove(function (err, review) {
                callback(err, review)
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

router.put("/:seikyo/reviews/:review", function (req, res, next) {
    common.setModelValues(req.body, req.review)
    req.review.save(function (err, review) {
        if (err) return next(common.catchUnhandledErrors(err));
        res.json(review)
    })
})

// REVIEW PARAMS
router.param('review', function (req, res, next, value) {
    Review.findById(value).exec(function (err, review) {
        if (err) return next(err);
        if (!review) return next({
        message: 'ReviewNotFound',
        status: 400
        });
        req.review = review;
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