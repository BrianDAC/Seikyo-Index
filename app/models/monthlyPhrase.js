var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var monthlyPhraseSchema = new Schema({
	name: {type: String, required: true},
	seikyo: {type: Schema.Types.ObjectId, ref: 'Seikyo', required: true}
});

monthlyPhraseSchema.virtual('created').get(function () {
    return this._id.getTimestamp();
});

mongoose.model('MonthlyPhrase', monthlyPhraseSchema);

