var mongoose = require('mongoose'),
    common = require('../common'),
    Schema = mongoose.Schema;

var userSchema = new Schema({
    username: { type: String, required: true, index: { unique: true, dropDups: true } },
    hash: { type: String, select: false },
    iterations: {type: Number, select: false },
    salt: { type: String, select: false },
    roles: [ { type: Schema.Types.ObjectId, ref: 'Role' } ],
},{
    toObject: {
        virtuals: true
    },
    toJSON: {
        virtuals: true
    }
});

userSchema.virtual('created').get(function () {
    return this._id.getTimestamp();
});

userSchema.virtual('password')
    .set(function (password) {
        this._password = password;
    })
    .get(function () {
        return this._password;
    });

userSchema.pre('save', function (next) {
    var user = this;

    if(user.password){
        common.encryptPassword(user.password,
            function (err, hash, salt, iterations) {
                if (err) return next({ message: 'UnhandledError', status: 400 });
                user.hash = hash;
                user.salt = salt;
                user.iterations = iterations;
                next();
            }
        );

    }else{
        next();
    }
});

userSchema.methods.encrypt = function(password, callback) {
    common.encryptPassword(password, callback, this);
};

userSchema.methods.toJSON = function(options){
    var user = this.toObject(options);

    delete user.hash;
    delete user.iterations;
    delete user.salt;
    delete user.password;

    return user;
};

mongoose.model('User', userSchema);
