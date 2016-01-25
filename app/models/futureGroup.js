var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var futureGroupSchema = new Schema({
	name: {type: String, required: true},
	seikyo: {type: Schema.Types.ObjectId, ref: 'Seikyo', required: true}
});

futureGroupSchema.virtual('created').get(function () {
    return this._id.getTimestamp();
});

mongoose.model('FutureGroup', futureGroupSchema);

