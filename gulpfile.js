/**
 * @fileOverview gulpfile
 * @author Kat Dixon
 * @version 1.0.0
 */

const gulp = require('gulp');
const del = require('del'); //clean
const rename = require('gulp-rename'); //add min to end
const browsersync = require("browser-sync").create(); //hot server

const concat = require('gulp-concat'); //concat js files
const uglify = require('gulp-uglify'); //minify js files
const eslint = require('gulp-eslint'); //lint the js
const plumber = require('gulp-plumber'); //patch to fix error handling
const babel = require('gulp-babel'); //babel for es6

var sass = require('gulp-sass')(require('sass'));
const postcss = require('gulp-postcss'); //css - autoprefixer etc
const autoprefixer = require('autoprefixer');
const cleancss = require('gulp-clean-css'); //sass - minify etc

const newer = require('gulp-newer'); //image - check newer
const fileinclude = require('gulp-file-include'); //templating

/*  --------------------------------------------
    Paths   --------------------------------------- */

const sa = 'src/assets/';
const ba = 'assets/';

const paths = {
  scriptsAll: sa + 'js/**/*',
  scriptsOrdered: [
    sa + 'js/vendor/lazysizes.min.js', //lazy loading
    //sa + 'js/vendor/glide.min.js', //some carousels
    //sa + 'js/vendor/splide.min.js', //Hero Banner + thumbs
    sa + 'js/main.js',
    sa + 'js/modules/*.js'
  ],
  html: ['src/templates/**/*.html', 
  '!src/templates/includes/*.html',
  '!src/templates/modules/**/*.html',
  '!src/templates/rendered/**/*.html',
  '!src/templates/svgs/**/*.html'],
  htmlAll: ['src/templates/**/*.html'],
  sass: sa + 'scss/',
  sassAll: sa + 'scss/**/*.scss',
  images: sa + 'img/**/*',
  imagesNotTemp: [sa + 'img/**/*', '!' + sa + 'img/temp/**/*'],
  fonts: sa + 'fonts/**/*',
  cmsbuild: '../jenn-do/',
  jsBuild: ba + '/js/',
  cssBuild: ba + '/css/',
  imgBuild: ba + '/img/'
};

/*  --------------------------------------------
    JS
   - ES6 Compiler breaks some files
   - Run compiler on subset then combine with ES5 only files and create final output
   --------------------------------------------  */

function jsES6Func() {
  return gulp
    .src(paths.scriptsOrdered)
    .pipe(plumber())
    .pipe(concat('main.min.js'))
    .pipe(
      babel({
        presets: ['@babel/env']
      })
    )
    .pipe(uglify())
    .pipe(gulp.dest(paths.cmsbuild + paths.jsBuild))
    .pipe(browsersync.stream());;
}

function jsLintFunc() {
  return gulp
    .src(paths.scriptsOrdered)
    .pipe(plumber())
    .pipe(eslint())
    .pipe(eslint.format());
}

/*  --------------------------------------------
    CSS  --------------------------------------- */

function cssFunc(filename) {
  return gulp
    .src(paths.sass + filename + '.scss')
    .pipe(plumber())
    .pipe(sass()) // Converts Sass to CSS with gulp-sass
    .pipe(postcss([autoprefixer()]))
    .pipe(cleancss())
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest(paths.cmsbuild + paths.cssBuild))
    .pipe(browsersync.stream());;
}

/*

only required when doing custom property editor styling

function cmsStyles(){
  return gulp.src(sa + 'scss/cms-colourblock.scss')
  .pipe(plumber())
  .pipe( sass() ) // Converts Sass to CSS with gulp-sass
  .pipe(cleancss())
  .pipe(rename({ basename: "cssdivider", }))
  .pipe( gulp.dest( '../PrettyPragmatic.Umbraco/App_Plugins/CustomBlockListViews' ) )
  .pipe(browsersync.stream());
}*/

/*  --------------------------------------------
    Images  ------------------------------------ */

function imageFunc() {
  return gulp
    .src(paths.imagesNotTemp)
    .pipe(newer(paths.cmsbuild + paths.imgBuild))
    .pipe(gulp.dest(paths.cmsbuild + paths.imgBuild));
}


/*  --------------------------------------------
    Templates  --------------------------------- */

    function templateFunc(){
      return gulp.src(paths.html)
        .pipe(plumber())
        .pipe( fileinclude({
            prefix: '@@',
            basepath: '@file'
        }) ) // Converts Sass to CSS with gulp-sass
        .pipe( gulp.dest( '../jenn-do/' ) )
        .pipe(browsersync.stream());
}

/*  --------------------------------------------
    Copy fonts  --------------------------------- */

function copyFunc() {
  return gulp.src(paths.fonts).pipe(gulp.dest(paths.cmsbuild + ba + '/fonts'));
}

/*  --------------------------------------------
    Clean  ------------------------------------- */

function cleanFunc() {
  return del([ba], { force: true });
}

/*  --------------------------------------------
    Browser Sync  ------------------------------ */

    function browserSync(done) {
      browsersync.init({
        server: {
          baseDir: paths.cmsbuild
        },
        port: 3000
      });
      done();
    }

/*  --------------------------------------------
    Watch task  -------------------------------- */

function watchFunc() {
  gulp.watch(paths.htmlAll, gulp.parallel('templates'));
  gulp.watch(paths.sassAll, gulp.parallel('css'));
  gulp.watch(paths.scriptsAll, gulp.parallel('js'));
  gulp.watch(paths.images, gulp.parallel('images'));
}

/*  --------------------------------------------
    Critical & Defer  -------------------------------- */
function criticalCssFunc() {
  return cssFunc('critical');
}
function deferredCssFunc() {
  return cssFunc('deferred');
}

/*  --------------------------------------------
    Tasks  ----------------------------------- */

gulp.task('clean', cleanFunc);
gulp.task('js', gulp.series(jsLintFunc, jsES6Func)); //lint the js then run
gulp.task('css', gulp.series(criticalCssFunc, deferredCssFunc));
gulp.task('images', gulp.series(imageFunc)); //minify images then remove temp images
gulp.task("templates", templateFunc);
gulp.task('copy', copyFunc);
gulp.task('watch', gulp.parallel(watchFunc, browserSync));

/*  --------------------------------------------
    Dynamic Sass  ----------------------------------- */

/*  --------------------------------------------
    Default  ----------------------------------- */

gulp.task(
  'default',
  gulp.series('clean', gulp.parallel('js', 'css', 'images', 'templates', 'copy'), 'watch')
);

gulp.task(
  'build',
  gulp.series('clean', gulp.parallel('js', 'css', 'images', 'templates', 'copy'))
);
