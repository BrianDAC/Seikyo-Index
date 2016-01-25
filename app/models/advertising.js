var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var advertisingSchema = new Schema({
	name: {type: String, required: true},
	seikyo: {type: Schema.Types.ObjectId, ref: 'Seikyo', required: true}
});

advertisingSchema.virtual('created').get(function () {
    return this._id.getTimestamp();
});

mongoose.model('Advertising', advertisingSchema);

