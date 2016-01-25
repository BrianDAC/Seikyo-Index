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

// ARTICLE
router.post("/:seikyo/articles", function (req, res, next) {
    var article = new Article(req.body);
    req.seikyo.article.push(article._id);

    async.parallel({
        article: function (callback) {
            article.save(function (err, article) {
                callback(err, article)
            })
        },
        seikyo: function (callback) {
            req.seikyo.save(function (err, seikyo) {
                callback(err, seikyo)
            })
        }
    },function (err, results) {
        if (err) return next(common.catchUnhandledErrors(err));
        res.json(article);
    });
})

router.get("/articles", function (req, res, next) {
    Article.find()
    .populate('seikyo')
    .exec(function (err, articles) {
        if (err) return next(common.catchUnhandledErrors(err));
        res.json(articles)
    })
})

router.delete("/:seikyo/articles/:article", function (req, res, next) {
    req.seikyo.article.splice(req.body.index, 1);
    async.parallel({
        article: function (callback) {
            req.article.remove(function (err, article) {
                callback(err, article)
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

router.put("/:seikyo/articles/:article", function (req, res, next) {
    common.setModelValues(req.body, req.article)
    req.article.save(function (err, article) {
        if (err) return next(common.catchUnhandledErrors(err));
        res.json(article)
    })
})

// ARTICLE PARAMS
router.param('article', function (req, res, next, value) {
    Article.findById(value).exec(function (err, article) {
        if (err) return next(err);
        if (!article) return next({
        message: 'ArticleNotFound',
        status: 400
        });
        req.article = article;
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