var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var sokaAdvanceSchema = new Schema({
	name: {type: String, required: true},
	seikyo: {type: Schema.Types.ObjectId, ref: 'Seikyo', required: true}
});

sokaAdvanceSchema.virtual('created').get(function () {
    return this._id.getTimestamp();
});

mongoose.model('SokaAdvance', sokaAdvanceSchema);