//var pmx = require('pmx');

//pmx.init();

var express = require('express'),
    config = require('./config/config'),
    common = require('./app/common');

common.connect();

var app = express();

require('./config/express')(app, config);

//app.use(pmx.expressErrorHandler());

app.listen(config.port);
