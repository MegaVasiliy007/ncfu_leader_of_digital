const gulp = require('gulp');

const buildCss = () => {
    const postcss = require('gulp-postcss'),
          autoprefixer = require('autoprefixer'),
          cssnano = require('gulp-cssnano'),
          rename = require("gulp-rename"),
          size = require('gulp-size');

    return gulp.src('./public/stylesheet/stylesheet.css')
          .pipe(postcss([ autoprefixer() ]))
          .pipe(cssnano())
          .pipe(size())
          .pipe(rename({suffix: '.min'}))
          .pipe(gulp.dest('./public/stylesheet/'))
};

exports.default = buildCss;