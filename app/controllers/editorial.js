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


// EDITORIAL
router.post("/:seikyo/editorials", function (req, res, next) {
    var editorial = new Editorial(req.body);
    req.seikyo.editorial.push(editorial._id);

    async.parallel({
        editorial: function (callback) {
            editorial.save(function (err, editorial) {
                callback(err, editorial)
            })
        },
        seikyo: function (callback) {
            req.seikyo.save(function (err, seikyo) {
                callback(err, seikyo)
            })
        }
    },function (err, results) {
        if (err) return next(common.catchUnhandledErrors(err));
        res.json(editorial);
    });
})

router.get("/editorials", function (req, res, next) {
    Editorial.find()
    .populate('seikyo')
    .exec(function (err, editorials) {
        if (err) return next(common.catchUnhandledErrors(err));
        res.json(editorials)
    })
})


router.delete("/:seikyo/editorials/:editorial", function (req, res, next) {
    req.seikyo.editorial.splice(req.body.index,1 );
    async.parallel({
        editorial: function (callback) {
            req.editorial.remove(function (err, editorial) {
                callback(err, editorial)
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

router.put("/:seikyo/editorials/:editorial", function (req, res, next) {
    common.setModelValues(req.body, req.editorial)
    req.editorial.save(function (err, editorial) {
        if (err) return next(common.catchUnhandledErrors(err));
        res.json(editorial)
    })
})

// EDITORIAL PARAMS
router.param('editorial', function (req, res, next, value) {
    Editorial.findById(value).exec(function (err, editorial) {
        if (err) return next(err);
        if (!editorial) return next({
        message: 'EditorialNotFound',
        status: 400
        });
        req.editorial = editorial;
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