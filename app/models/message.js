var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var messageSchema = new Schema({
	name: {type: String, required: true},
	seikyo: {type: Schema.Types.ObjectId, ref: 'Seikyo', required: true}
});

messageSchema.virtual('created').get(function () {
    return this._id.getTimestamp();
});

mongoose.model('Message', messageSchema);

