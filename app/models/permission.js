var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var permissionSchema = new Schema({
    name: { type: String, required: true, index:{ unique:true, dropDups:true }},
    method: { type: String, required:true },
    path: { type: String, required: true }
});

permissionSchema.virtual('created').get(function () {
    return this._id.getTimestamp();
});

module.exports = mongoose.model('Permission', permissionSchema);
