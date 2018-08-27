const gulp = require('gulp');
const cleanCSS = require('gulp-clean-css');
const sass = require('gulp-sass');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const autoprefixer = require('gulp-autoprefixer');
const babel = require('gulp-babel');
const twig = require('gulp-twig');
const connect = require('gulp-connect');
const webserver = require('gulp-webserver');

const paths = {
    output: './public',
    templates: {
        enter: './src/templates/index.twig',
        watch: './src/templates/**/*'
    },
    styles: {
        enter: './src/styles/app.sass',
        watch: ['./src/styles/**/*', '!./src/styles/bundle-main.min.css']
    },
    javascript: {
        enter: './src/javascript/app.js',
        watch: ['./src/javascript/**/*', '!./src/javascript/bundle-main.min.js']
    }
};

function server() {
    gulp.src(paths.output).pipe(webserver({
        livereload: true,
        open: true
    }));
}

function styles() {
    return gulp.src(paths.styles.enter)
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer({browsers: ['> 1%'], cascade: false}))
        .pipe(cleanCSS({compatibility: 'ie8'}))
        .pipe(connect.reload())
        .pipe(concat('bundle.min.css'))
        .pipe(gulp.dest(paths.output));
}

function javascript() {
    let poly = './node_modules/babel-polyfill/dist/polyfill.js';

    return gulp.src([poly, paths.javascript.enter])
        .pipe(babel())
        .pipe(uglify())
        .pipe(connect.reload())
        .pipe(concat('bundle.min.js'))
        .pipe(gulp.dest(paths.output));
}

function templates() {
    const data = {
        data: {
            title: 'Gulp and Twig',
            benefits: [
                'Fast',
                'Flexible',
                'Secure'
            ]
        }
    };

    return gulp.src(paths.templates.enter)
        .pipe(twig(data))
        .pipe(connect.reload())
        .pipe(gulp.dest(paths.output));
}

function watch() {
    gulp.watch(paths.styles.watch, styles);
    gulp.watch(paths.javascript.watch, javascript);
    gulp.watch(paths.templates.watch, templates);
    server()
}

gulp.task('build', gulp.parallel(styles, javascript, templates));
gulp.task('watch', watch);
