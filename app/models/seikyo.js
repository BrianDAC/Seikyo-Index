var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var seikyoSchema = new Schema({
    date: {type: Date, required: true, unique: true},
    year: {type: String, required: true},
	advertising: [{type: Schema.Types.ObjectId, ref: 'Advertising'}],
	article: [{type: Schema.Types.ObjectId, ref: 'Article'}],
	basicTerm: [{type: Schema.Types.ObjectId, ref: 'BasicTerm'}],
	editorial: [{type: Schema.Types.ObjectId, ref: 'Editorial'}],
	experience: [{type: Schema.Types.ObjectId, ref: 'Experience'}],
	femenineDivision: [{type: Schema.Types.ObjectId, ref: 'FemenineDivision'}],
	futureGroup: [{type: Schema.Types.ObjectId, ref: 'FutureGroup'}],
	masculineDivision: [{type: Schema.Types.ObjectId, ref: 'MasculineDivision'}],
	message: [{type: Schema.Types.ObjectId, ref: 'Message'}],
	monthlyPhrase: [{type: Schema.Types.ObjectId, ref: 'MonthlyPhrase'}],
	orientation: [{type: Schema.Types.ObjectId, ref: 'Orientation'}],
	review: [{type: Schema.Types.ObjectId, ref: 'Review'}],
	sokaAdvance: [{type: Schema.Types.ObjectId, ref: 'SokaAdvance'}],
	studentGroup: [{type: Schema.Types.ObjectId, ref: 'StudentGroup'}]
});

seikyoSchema.virtual('created').get(function () {
    return this._id.getTimestamp();
});

mongoose.model('Seikyo', seikyoSchema);
