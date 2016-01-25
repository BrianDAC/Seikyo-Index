var mongoose = require('mongoose'),
    PermissionSchema = require('./permission').schema,
    Schema = mongoose.Schema;

var roleSchema = new Schema({
    name: { type:String, required: true, index:{ unique:true, dropDups: true }},
    permissions: [ PermissionSchema ]
});

roleSchema.virtual('created').get(function () {
    return this._id.getTimestamp();
});

mongoose.model('Role', roleSchema);
