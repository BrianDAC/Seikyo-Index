var mongoose = require('mongoose'),
    Division = mongoose.model('Division');

exports.up = function(next){
    var djf = new Division(),
        djm = new Division(),
        df = new Division(),
        dm = new Division();

    djf.name = "DJF";
    djm.name = "DJM";
    dm.name = "DM";
    df.name = "DF";

    djf.save(function (err, djf) {
        if (err) return next (err);
    });
    djm.save(function (err, djf) {
        if (err) return next (err);
    });
    dm.save(function (err, djf) {
        if (err) return next (err);
    });
    df.save(function (err, djf) {
        if (err) return next (err);
        next();
    });

};

exports.down = function(next){
    Division.findOneAndRemove({ name:'DF'}), 
    Division.findOneAndRemove({ name:'DM'}), 
    Division.findOneAndRemove({ name:'DJF'}), 
    Division.findOneAndRemove({ name:'DJM'}, next); 
};
