var path = require('path'),
    rootPath = path.normalize(__dirname + '/..'),
    database = require('./database'),
    env = process.env.NODE_ENV || 'development';

var config = {
    development: {
        rootPath: rootPath,
        app: {
            publicPath: 'http://localhost:3005',
            frontendPath: 'http://localhost:9005',
            adminPath: 'http://admin.seikyo.co'
        },
        port: 3005,
        db: 'mongodb://'+database.user+':'+database.pwd+'@'+database.host+'/'+database.db,
        key:'4050596a75542acc15f44d256ee7bb8d'
    },

    test: {
        rootPath: rootPath,
        app: {
            publicPath: 'http://localhost:3005',
            frontendPath: 'http://localhost:9005',
            adminPath: 'http://admin.seikyo.co'
        },
        port: 3005,
        db: 'mongodb://'+process.env.WERCKER_MONGODB_HOST+'/seikyo',
        key:'4050596a75542acc15f44d256ee7bb8d'
    },

    staging: {
        rootPath: rootPath,
        app: {
            publicPath: 'http://devapi.seikyo.com',
            frontendPath: 'http://index.seikyo.com',
            adminPath: 'http://admin.seikyo.co'
        },
        port: 3005,
        db: 'mongodb://'+database.user+':'+database.pwd+'@'+database.host+'/'+database.db,
        key:'4050596a75542acc15f44d256ee7bb8d'
    },

    production: {
        rootPath: rootPath,
        app: {
            publicPath: 'http://api.seikyo.com',
            frontendPath: 'http://doctor.seikyo.com',
            adminPath: 'http://admin.seikyo.co'
        },
        port: 3005,
        db: 'mongodb://'+database.user+':'+database.pwd+'@'+database.host+'/'+database.db,
        key:'4050596a75542acc15f44d256ee7bb8d'
    }
};

module.exports = config[env];
