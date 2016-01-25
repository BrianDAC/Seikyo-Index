var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var femenineDivisionSchema = new Schema({
	name: {type: String, required: true},
	seikyo: {type: Schema.Types.ObjectId, ref: 'Seikyo', required: true}
});

femenineDivisionSchema.virtual('created').get(function () {
    return this._id.getTimestamp();
});

mongoose.model('FemenineDivision', femenineDivisionSchema);

