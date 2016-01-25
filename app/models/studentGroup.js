var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var studentGroupSchema = new Schema({
	name: {type: String, required: true},
	seikyo: {type: Schema.Types.ObjectId, ref: 'Seikyo', required: true}
});

studentGroupSchema.virtual('created').get(function () {
    return this._id.getTimestamp();
});

mongoose.model('StudentGroup', studentGroupSchema);