var gulp = require("gulp"),
    minifyJs = require("gulp-uglify"), //Minify JS
    concat = require("gulp-concat"), // concatenate separate js files in raw folder
    sass = require("gulp-sass"), // compile all sass files in raw folder into one main.css
    rename = require("gulp-rename"), // renames a compiled css file.
    minifyCss = require("gulp-minify-css"),
    plumber = require("gulp-plumber"), // error handlings
    imagemin = require("gulp-imagemin"), // minify asset images
    browserSync = require("browser-sync"), //live from the browser
    usemin = require("gulp-usemin"), //bundles all hrefs in the raw index file and distributes it in the dist file
    prefix = require("gulp-autoprefixer"), //auto prefixes vendor prefixes for sass
    gutil = require("gulp-util"),
    inject = require("gulp-inject"),
  //Not Installed
  getFile = require("gulp-bower"), //moves installed bower packages to our dist file
  flatten = require("gulp-flatten"); //retrieves a specific file from our bower components //check npm docs for more

//Testing
//************************************************************************


//************************************************************************



//Don't remove
var reload = browserSync.reload;


//file paths
var paths = {
  js: 'raw/js/**/*.*',
  styles: 'raw/scss/**/*.*',
  rawIndex: 'raw/index.html',
  img: 'raw/img/*',
  ejs: 'raw/views/*.ejs',
  bower_fonts: 'bower_components/**/*.{ttf,woff,eof,svg,eot,woff2}',
};

//bundler
/**********************************************************************/
gulp.task('usemin', function() {
  //bundles all hrefs in our raw file and distributes it into our dist file and automatically links them in our new index.html
  return gulp.src(paths.rawIndex)
    .pipe(plumber())
    .pipe(usemin({
      jslibs: ['concat'], //defined in the scripts tag area in index.html raw file
      csslibs: [minifyCss(),'concat'], //defined in the stylesheets tag area in index.html raw file
      maincss: [] //defined in the stylesheets tag are in index.html raw file
    }))
    // .pipe(rename('built.html'))
    .pipe(gulp.dest('dist/'))
    .pipe(reload({stream:true}));
});
/**********************************************************************/




//Handle File transfers
/**********************************************************************/
gulp.task('copy-bower-fonts', function(){
  return gulp.src(paths.bower_fonts)
        .pipe(rename({
          dirname: '/fonts'
        }))
        .pipe(gulp.dest('dist/templates'));
});
/**********************************************************************/



//scripts
/**********************************************************************/
gulp.task('scripts', function() {
  return gulp.src(paths.js)
    .pipe(plumber())
    .pipe(concat('main.js'))
    .pipe(minifyJs())
    .pipe(gulp.dest('dist/js'))
    .pipe(reload({stream:true}));

});
/**********************************************************************/



//stylesheets
//compile all scss files
/**********************************************************************/
gulp.task('stylesheets', function() {
  return gulp.src(paths.styles)
    .pipe(plumber())
    .pipe(sass({
      outputStyle: 'expanded'
    }))
    .pipe(prefix())
    .pipe(rename('main.css'))
    .pipe(gulp.dest('dist/css'))
    .pipe(reload({stream:true}));

});
/**********************************************************************/



//compress Images
/**********************************************************************/
gulp.task('image', function(){
  return gulp.src(paths.img)
         .pipe(imagemin())
         .pipe(gulp.dest('dist/img'));
});

/**********************************************************************/


//Browser Sync
/**********************************************************************/
gulp.task("browser-sync",function(){
  browserSync({
    server: {
      baseDir: './dist/'
    }
  })
});
/**********************************************************************/


//Watch files
/**********************************************************************/
gulp.task('watch', function() {
  gulp.watch('raw/js/*.js', ['scripts']); //watches all js changes in raw/js directory
  gulp.watch('raw/scss/**/*.scss', ['stylesheets']), //watches the main scss file
    ('raw/scss/_mixins/**/*.scss', ['stylesheets']), //watches the mixins folder
    ('raw/scss/_partials-components/**/*.scss', ['stylesheets']); //watches all scss changes in raw/scss/_partials-components
  gulp.watch(paths.rawIndex ,['usemin']);
  gulp.watch('raw/img*', ['image']);
});
/**********************************************************************/


//Asset Builders
//compile scss files in the raw folder and distribute it to the dist folder
//concats all js files in the raw folder

/**********************************************************************/
//Initialize these steps first
//1st compile assets
gulp.task('compile', ['scripts', 'stylesheets']); //1st Step

//Main gulp tasks use this only
//compile sass + js files
//and distribute them
//2nd link all the bundles together in the index file
gulp.task('build', ['usemin','image','copy-bower-fonts']); //2nd Step


//Main gulpfile task to watch for changes + compile and distritbute
gulp.task('default', ['compile', 'build','browser-sync','watch']); // Default Task after init

/**********************************************************************/
