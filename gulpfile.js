var gulp = require('gulp'),
    nodemon = require('gulp-nodemon'),
    livereload = require('gulp-livereload');


gulp.task('develop', function () {
    livereload.listen();
    nodemon({
        script: 'app.js'
    }).on('readable', function() {
        this.stdout.on('data', function(chunk) {
            if (/^listening/.test(chunk)) {
                livereload.reload();
            }
            process.stdout.write(chunk);
        })
    })
});

gulp.task('default', [
    'develop'
]);