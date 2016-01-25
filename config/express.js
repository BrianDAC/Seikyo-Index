var express = require('express'),
    cors = require('cors'),
    path = require('path'),
    bodyParser = require('body-parser'),
    compress = require('compression'),
    methodOverride = require('method-override'),
    jwt = require('express-jwt'),
    mongoose = require('mongoose'),
    fs = require('fs'),
    util = require('util'),
    log4js = require('log4js'),
    access = require('../app/common/access'),
    glob = require('glob');

require('colors');

module.exports = function (app, config) {

    app.set('views', config.rootPath + '/app/views');
    app.set('view engine', 'jade');

    fs.existsSync(config.rootPath + '/uploads') || fs.mkdirSync(config.rootPath + '/uploads');

    log4js.configure({
        appenders: [
            {
                "type": "dateFile",
                "filename": "logs/log.log",
                "pattern": "-yyyy-MM-dd"
            },
            {
                "type": "console"
            }
        ]
    });

    var logger = log4js.getLogger();

    app.use(log4js.connectLogger(logger, {
        format: ':method :url :status :response-time ms - :content-length'
    }));

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({
        extended: true
    }));

    app.use(compress());

    app.use(cors());

    app.use('/public', express.static(path.normalize(config.rootPath + '/public')));

    app.use('/uploads', express.static(path.normalize(__dirname + '/../uploads')));

    app.use(methodOverride());

    app.use(function (req, res, next) {
        if(Object.keys(req.query).length) {
            logger.info('QUERY'.blue);
            logger.info(util.inspect(req.query, {colors: true}));
        }
        if(Object.keys(req.body).length) {
            logger.info('BODY'.yellow);
            logger.info(util.inspect(req.body, {colors: true}));
        }
        next();
    });

    app.use(jwt({secret: config.key }).unless(function(req){
        console.log(req.path)
        return  /api\/seikyos\/(.)*$/ig.test(req.path) ||
        (req.method == 'POST' && req.path == '/token') ||
        /api\/seikyo\/(.)*$/ig.test(req.path)
    }));

    app.use(function (req, res, next){
        if(!!req.user){
            mongoose.model('User').findOne({ _id: req.user._id })
                .populate('roles')
                .exec(function(err, user){
                    if (err) return next(err);
                    if (!user) return next(new Error('TokenInvalid'));

                    req.user = user;

                    next();
                });
        }else{
            next();
        }
    });

    var controllers = glob.sync(config.rootPath + '/app/controllers/**/*.js');
    controllers.forEach(function (controller) {
        require(controller)(app);
    });

    app.use(function (req, res, next) {

        var err = new Error('Not Found');
        err.status = 404;
        if (err.name === 'UnauthorizedError') {
            err.status = 401;
        }
        next(err);
    });

    if (app.get('env') === 'development' || app.get('env') === 'staging') {
        app.use(function (err, req, res, next) {
            logger.error('ERROR'.red);
            logger.error(util.inspect(err, {colors: true}));
            res
                .status(err.status || 400)
                .json({
                    message: err.message,
                    error: err,
                    title: 'error'
                }
            );
        });
    }

    app.use(function (err, req, res, next) {
        console.log('ERROR'.red);
        console.dir(err, {colors: true});
        res
            .status(err.status || 400)
            .json({
                message: err.message,
                error: {},
                title: 'error'
            }
        );
    });

};
