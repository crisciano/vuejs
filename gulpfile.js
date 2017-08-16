var gulp = require('gulp')
  ,imagemin       = require('gulp-imagemin')
  ,clean          = require('gulp-clean')
  ,concat         = require('gulp-concat')
  ,htmlReplace    = require('gulp-html-replace')
  ,uglify         = require('gulp-uglify')
  ,usemin         = require('gulp-usemin')
  ,cssmin         = require('gulp-cssmin')
  ,browserSync    = require('browser-sync').create()
  ,jshint         = require('gulp-jshint')
  ,jshintStylish  = require('jshint-stylish')
  ,csslint        = require('gulp-csslint')
  ,autoprefixer   = require('gulp-autoprefixer')
  ,cssnano        = require('gulp-cssnano')
  ,htmlmin        = require('gulp-htmlmin')
  ,gulpif         = require('gulp-if')
  ,useref         = require('gulp-useref')
  ,inlineSource   = require('gulp-inline-source')
  ,sass           = require('gulp-sass')
  ,babel          = require('gulp-babel')
  ,connect        = require('gulp-connect-php')
  ,tinypng        = require('gulp-tinypng')
  ,webserver      = require('gulp-webserver')
  ,mkdir          = require('mkdirp')
  ,gutil          = require('gulp-util')
  ,ftp            = require('gulp-ftp');

let host          = '';                   /* host para o ftp */
let user          = '';                   /* user para o ftp */
let pass          = '';                   /* pass para o ftp */
let dirDist       = '/public_html/dist';  /* dir de teste*/
let dirPublic     = '/public_html';       /*dir de dev */

gulp.task('default', ['useref','copyPHP', 'copyFonts', 'copyVideo', 'build-img'], function() {
	//gulp.start('build-img');
});

gulp.task('copy', ['clean'], function() {
	return gulp.src('src/**/*')
		.pipe(gulp.dest('dist'));
});

gulp.task('copyPHP', function() {
    return gulp.src('src/php/*')
        .pipe(gulp.dest('dist/php'));
});

gulp.task('copyFonts', function() {
    return gulp.src('src/fonts/*')
        .pipe(gulp.dest('dist/fonts'));
});

gulp.task('copyVideo',function(){
  return gulp.src('src/video/*')
        .pipe(gulp.dest('dist/video'));
});

gulp.task('clean', function() {
	return gulp.src('dist')
		.pipe(clean());
});

gulp.task('build-img', function() {

  return gulp.src('src/img/*')
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [
                {removeViewBox: false},
                {cleanupIDs: false}
            ]
        }))
        .pipe(tinypng('2fTBYUG9ROnvcw5jclwjWsXP8n2SF_-Z'))
        .pipe(gulp.dest('dist/img'));
});

// minificação
gulp.task('minify-js', function() {
  return gulp.src('src/**/*.js')
    .pipe(babel({presets: ['es2015']}))
    .pipe(concat("all.js"))
    .pipe(uglify({ compress: true }).on('error', function(e){
         console.log(e);
    }))
    .pipe(gulp.dest('dist/js'))
});

gulp.task('minify-css', function() {
  return gulp.src('src/**/*.css')
    .pipe(cssnano())
    .pipe(gulp.dest('dist'))
});

gulp.task('minify-html', function() {
  return gulp.src('src/*.html')
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest('dist'))
});

/* Concatenação */
gulp.task('useref', function () {
    return gulp.src('src/*.html')
        .pipe(useref())
        .pipe(gulpif('*.html', inlineSource()))
        .pipe(gulpif('*.html', htmlmin({collapseWhitespace: true})))
        .pipe(gulpif('*.js',babel({
            compact: false,
            presets: [['es2015', {modules: false}]]
        })))
        .pipe(gulpif('*.js', uglify({ compress: false })))
        .pipe(gulpif('*.css', cssnano({safe: true})))
        .pipe(gulp.dest('dist'));
});

/* deploy dist ftp */
gulp.task('deployDist', ['default'], function () {
   return gulp.src('dist/**/*')
   .pipe(ftp({
     host: host,
     user: user,
     pass: pass,
     remotePath: dirDist
   }))
   .pipe(gutil.noop());
});

/* deploy public ftp */
gulp.task('deployPublic', ['default'], function () {
   return gulp.src('dist/**/*')
   .pipe(ftp({
     host: host,
     user: user,
     pass: pass,
     remotePath: dirPublic
   }))
   .pipe(gutil.noop());
});

//server
gulp.task('server', function() {
    connect.server();
    
    browserSync.init({
        server: {
            baseDir: 'src'
        }
    });

    gulp.watch('src/**/*').on('change', browserSync.reload);

    gulp.watch('src/js/**/*.js').on('change', function(event) {
        console.log("Linting " + event.path);
        gulp.src(event.path)
            .pipe(jshint({esversion: 6}))
            .pipe(jshint.reporter(jshintStylish));
    });

    gulp.watch('src/css/**/*.css').on('change', function(event) {
        console.log("Linting " + event.path);
        gulp.src(event.path)
            .pipe(csslint())
            .pipe(csslint.reporter());            
    }); 

    gulp.watch('src/img/**/*').on('change', function(event) {
        gulp.src(event.path)
            .pipe(gulp.dest('src/img'));
    })

    gulp.watch('src/video/**/*').on('change', function(event){
        gulp.src(event.path)
            .pipe(gulp.dest('src/video'));
    });

    gulp.watch('src/sass/*.scss').on('change', function(event) {
       var stream = gulp.src('src/sass/*.scss')
            .pipe(sass().on('error', function(erro) {
              console.log('Sass, erro compilação: ' + erro.filename);
              console.log(erro.message);
            }))
            .pipe(gulp.dest('src/css'));
    });   
});

// let project = 'test'
// let destiny = 'C:/wamp/apache2/htdocs/'+ project;
// gulp.task('bk', ['bk-remove'], function(){
//   gulp.src('src/**/*').pipe(
//     gulp.dest(destiny)
//   );
// });

gulp.task('bk-remove', function(){
  return gulp.src(destiny).pipe(clean());
});

// server php
gulp.task('connect', function() {
  // connect.server({
  //     base: 'src',
  //     open: true,
  //     debug: true
  // }, function (){
  //   browserSync.init({
  //     proxy: 'localhost:8000'
  //   });
  // });
  // connect.server({
  //     base: 'src',
  //     open: true,
  //     debug: true
  // }, function (){
  //   browserSync.init({
  //     proxy: 'localhost:8000'
  //   });
  // });


  gulp.src('./src')
    .pipe(webserver({
      open: 'http://localhost:8000/index.html',
      fallback: 'index.html',
      port: 8000,
      livereload: true,
      directoryListing:{
        enable: true,
        path: './src'
      }
    }));
/**
  connect.server({}, function (){
    browserSync.init({
      baseDir: 'src',
      proxy: '127.0.0.1:8000'
    });
  });
**/ 
/**
gulp.task('connect', function() {
  connect.server({}, function (){
    browserSync.init({
      proxy: '127.0.0.1:8080'
    });
  });**/


    gulp.watch('src/**/*').on('change', browserSync.reload);

    gulp.watch('src/php/**/*.php').on('change', browserSync.reload);

    gulp.watch('src/js/**/*.js').on('change', function(event) {
        console.log("Linting " + event.path);
        gulp.src(event.path)
            .pipe(jshint({esversion: 6}))
            .pipe(jshint.reporter(jshintStylish));
    });

    gulp.watch('src/css/**/*.css').on('change', function(event) {
        console.log("Linting " + event.path);
        gulp.src(event.path)
            .pipe(csslint())
            .pipe(csslint.reporter());            
    }); 

    gulp.watch('src/img/**/*').on('change', function(event) {
        gulp.src(event.path)
            //.pipe(tinypng('2fTBYUG9ROnvcw5jclwjWsXP8n2SF_-Z'))
            .pipe(gulp.dest('src/img'));
    })

    gulp.watch('src/sass/*.scss').on('change', function(event) {
       var stream = gulp.src('src/sass/*.scss')
            .pipe(sass().on('error', function(erro) {
              console.log('Sass, erro compilação: ' + erro.filename);
              console.log(erro.message);
            }))
            .pipe(gulp.dest('src/css'));
    });   
});
