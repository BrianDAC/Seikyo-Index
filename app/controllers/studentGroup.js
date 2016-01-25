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


// STUDENTGROUP
router.post("/:seikyo/studentGroups", function (req, res, next) {
    var studentGroup = new StudentGroup(req.body);
    req.seikyo.studentGroup.push(studentGroup._id);

    async.parallel({
        studentGroup: function (callback) {
            studentGroup.save(function (err, studentGroup) {
                callback(err, studentGroup)
            })
        },
        seikyo: function (callback) {
            req.seikyo.save(function (err, seikyo) {
                callback(err, seikyo)
            })
        }
    },function (err, results) {
        if (err) return next(common.catchUnhandledErrors(err));
        res.json(studentGroup);
    });
})

router.get("/studentGroups", function (req, res, next) {
    StudentGroup.find()
    .populate('seikyo')
    .exec(function (err, studentGroups) {
        if (err) return next(common.catchUnhandledErrors(err));
        res.json(studentGroups)
    })
})

router.delete("/:seikyo/studentGroups/:studentGroup", function (req, res, next) {
    req.seikyo.studentGroup.splice(req.body.index, 1);
    async.parallel({
        studentGroup: function (callback) {
            req.studentGroup.remove(function (err, studentGroup) {
                callback(err, studentGroup)
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

router.put("/:seikyo/studentGroups/:studentGroup", function (req, res, next) {
    common.setModelValues(req.body, req.studentGroup)
    req.studentGroup.save(function (err, studentGroup) {
        if (err) return next(common.catchUnhandledErrors(err));
        res.json(studentGroup)
    })
})

// STUDENTGROUP PARAMS
router.param('studentGroup', function (req, res, next, value) {
    StudentGroup.findById(value).exec(function (err, studentGroup) {
        if (err) return next(err);
        if (!studentGroup) return next({
        message: 'StudentGroupNotFound',
        status: 400
        });
        req.studentGroup = studentGroup;
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