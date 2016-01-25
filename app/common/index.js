var crypto = require('crypto'),
    mongoose = require('mongoose'),
    fs = require('fs');
    config = require('../../config/config');

exports.encryptPassword = function(password, callback, config){
    config = config || {
        salt:crypto.randomBytes(16/*128*/).toString('base64'),
        iterations:32000 + Math.floor(Math.random() * 32000)
    };
    //var iterations = 90510 + Math.floor(Math.random() * 32000);
    crypto.pbkdf2(password, config.salt, config.iterations, 512, function(err, derivedKey){
        callback(err, derivedKey.toString('base64'), config.salt, config.iterations);
    });
};

exports.connect = function(){
    mongoose.connect(config['db']);

    mongoose.connection.on('error', function(err){
        console.log(err);
        throw new Error('unable to connect to database');
    });

    var modelsPath = config['rootPath'] + '/app/models';
    fs.readdirSync(modelsPath).forEach(function (file) {
        if (file.indexOf('.js') >= 0) {
            require(modelsPath + '/' + file);
        }
    });
};

exports.disconnect = function(){
    mongoose.disconnect();
};

exports.setModelValues = function(body, model){
    for(var property in body){
        if (property in model) { //noinspection JSUnfilteredForInLoop
            model[property] = body[property];
        }
    }
};

exports.catchUnhandledErrors = function(err){
    console.log(err);
    var error = {
        status: 400,
        message: 'UnhandledError'
    };

    if(err.errors) {
        error.message = 'SchemaError';
        error.details = [];
        for(var key in err.errors) {
            error.details.push(err.errors[key].message);
        }

        error.details = error.details.join('|');

    }else{
        switch (err.code){
            case 11000:
                error.message = 'DocumentAlreadyExist';
                break;
            case 'EACCES':
                error.message = 'PermissionDenied';
                break;
        }
    }

    console.log(error);
    return error;
};

exports.assign = function (schema) {
    return function (object) {
        (function deepAssign (target, object, path) {
            for (var key in object) {
                if (key !== '_id') {
                    var concat = path.concat(key);
                    var attr = schema.path(concat.join('.'));
                    if (key in target && !attr) {
                        deepAssign(target[key], object[key], concat);
                    } else if (!attr || !(attr.options.select === false)) {
                        target[key] = object[key];
                    }
                }
            }
        })(this, object, []);
    };
};