var gulp = require('gulp'),
    browserify = require('browserify'),
    source = require('vinyl-source-stream');

gulp.task('build', function () {

    browserify()
        .require('react', { expose: 'react' })
        .require('flux', { expose: 'flux' })
        .bundle()
        .pipe(source('bundle.js'))
        .pipe(gulp.dest('./public/dist'));

});

gulp.task('default', ['build']);
