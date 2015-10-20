var gulp = require('gulp'),
    browserify = require('browserify'),
    source = require('vinyl-source-stream'),
    buffer = require('vinyl-buffer'),
    uglify = require('gulp-uglify');

gulp.task('build', function () {

    browserify()
        .require('react/addons', { expose: 'react' })
        .require('flux', { expose: 'flux' })
        .require('./public/src/jquery', { expose: 'jquery' })
        .require('./public/src/i18n', { expose: 'i18n' })
        .bundle()
        .pipe(source('bundle.js'))
        .pipe(buffer())
        .pipe(uglify())
        .pipe(gulp.dest('./public/dist'));

});

gulp.task('default', ['build']);
