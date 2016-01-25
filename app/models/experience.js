var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var experienceSchema = new Schema({
	name: {type: String, required: true},
	owner: {type: String, required: true},
	division: {type: Schema.Types.ObjectId, ref: 'Division'},
	seikyo: {type: Schema.Types.ObjectId, ref: 'Seikyo', required: true}
});

experienceSchema.virtual('created').get(function () {
    return this._id.getTimestamp();
});

mongoose.model('Experience', experienceSchema);

