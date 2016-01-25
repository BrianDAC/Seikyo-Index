var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var orientationSchema = new Schema({
	name: {type: String, required: true},
	seikyo: {type: Schema.Types.ObjectId, ref: 'Seikyo', required: true}
});

orientationSchema.virtual('created').get(function () {
    return this._id.getTimestamp();
});

mongoose.model('Orientation', orientationSchema);

