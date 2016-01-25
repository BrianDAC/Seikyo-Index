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

// EXPERIENCE
router.post("/:seikyo/experiences", function (req, res, next) {
    var experience = new Experience(req.body);
    req.seikyo.experience.push(experience._id);

    async.parallel({
        experience: function (callback) {
            experience.save(function (err, experience) {
                callback(err, experience)
            })
        },
        seikyo: function (callback) {
            req.seikyo.save(function (err, seikyo) {
                callback(err, seikyo)
            })
        }
    },function (err, results) {
        if (err) return next(common.catchUnhandledErrors(err));
        res.json(experience);
    });
})

router.get("/experiences", function (req, res, next) {
    Experience.find()
    .populate('seikyo')
    .populate('division')
    .exec(function (err, experiences) {
        if (err) return next(common.catchUnhandledErrors(err));
        res.json(experiences)
    })
})


router.delete("/:seikyo/experiences/:experience", function (req, res, next) {
    req.seikyo.experience.splice(req.body.index, 1);
    async.parallel({
        experience: function (callback) {
            req.experience.remove(function (err, experience) {
                callback(err, experience)
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

router.put("/:seikyo/experiences/:experience", function (req, res, next) {
    common.setModelValues(req.body, req.experience)
    req.experience.save(function (err, experience) {
        if (err) return next(common.catchUnhandledErrors(err));
        res.json(experience)
    })
})

// EXPERIENCE PARAMS
router.param('experience', function (req, res, next, value) {
    Experience.findById(value).exec(function (err, experience) {
        if (err) return next(err);
        if (!experience) return next({
        message: 'ExperienceNotFound',
        status: 400
        });
        req.experience = experience;
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