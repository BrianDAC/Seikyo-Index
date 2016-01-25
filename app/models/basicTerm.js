var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var basicTermSchema = new Schema({
	name: {type: String, required: true},
	seikyo: {type: Schema.Types.ObjectId, ref: 'Seikyo', required: true}
});

basicTermSchema.virtual('created').get(function () {
    return this._id.getTimestamp();
});

mongoose.model('BasicTerm', basicTermSchema);

