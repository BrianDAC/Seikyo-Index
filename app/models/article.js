var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var articleSchema = new Schema({
	name: {type: String, required: true},
	seikyo: {type: Schema.Types.ObjectId, ref: 'Seikyo', required: true}
});

articleSchema.virtual('created').get(function () {
    return this._id.getTimestamp();
});

mongoose.model('Article', articleSchema);

