var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var divisionSchema = new Schema({
	name: {type: String, required: true}
});

divisionSchema.virtual('created').get(function () {
    return this._id.getTimestamp();
});

mongoose.model('Division', divisionSchema);