var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var masculineDivisionSchema = new Schema({
	name: {type: String, required: true},
	seikyo: {type: Schema.Types.ObjectId, ref: 'Seikyo', required: true}
});

masculineDivisionSchema.virtual('created').get(function () {
    return this._id.getTimestamp();
});

mongoose.model('MasculineDivision', masculineDivisionSchema);

