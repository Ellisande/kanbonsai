var gulp = require('gulp');
var nodemon = require('gulp-nodemon');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var minify = require('gulp-minify-css');
var jshint = require('gulp-jshint');
var csslint = require('gulp-csslint');
var clean = require('gulp-clean');
var protractor = require('gulp-protractor').protractor;
var parsedArgs = require('minimist')(process.argv.slice());

gulp.task('protractor', function() {

    gulp.src('./test/e2e/*.js')
    .pipe(
      protractor(
        {
          configFile: "./test/e2e/conf.js",
          args: ['--suite', parsedArgs.suite ? parsedArgs.suite : 'all']
        }
      ));

});

gulp.task('e2e-clean', function(){
  gulp.src('test/screenshots', {read: false})
    .pipe(clean());
});

gulp.task('e2e', ['e2e-clean', 'protractor']);

gulp.task('js-minify', function(){
    return gulp.src('app/js/**/*.js')
        .pipe(concat('app.js'))
//        .pipe(uglify())
        .pipe(gulp.dest('build'));
});

gulp.task('js-lint', function(){
    return gulp.src('app/js/**/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

gulp.task('css-minify', function(){
    return gulp.src(['app/css/**/*.css'])
        .pipe(concat('app.css'))
        .pipe(minify())
        .pipe(gulp.dest('build'));
});

gulp.task('css-lint', function(){
    return gulp.src('app/css/**/*.css')
        .pipe(csslint())
        .pipe(csslint.reporter('default'));
});



gulp.task('node', function(){
  nodemon({
      script: 'coffee-server.js',
      ext: 'js',
      ignore: ['node_modules/**', 'app/**/*.js','config/**/*.js','test/**/*.js'] }
    )
    .on('restart', function () {
      console.log('restarted!');
    });
});

gulp.task('lint', ['js-lint', 'css-lint']);

gulp.task('minify', ['css-minify','js-minify']);

gulp.task('watch', function(){
    gulp.watch('app/js/**/*.js', ['js-minify', 'js-lint']);
    gulp.watch('app/css/**/*.css', ['css-minify', 'css-lint' ]);
});

gulp.task('default', ['node','minify', 'lint','watch']);
