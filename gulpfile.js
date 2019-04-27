const gulp = require('gulp');
const browserify = require('browserify');
const gutil = require('gulp-util');
const sass = require('gulp-sass');
const source = require('vinyl-source-stream');
const rename = require('gulp-rename');
const uglify = require('gulp-uglify');
const cssnano = require('gulp-cssnano');
const es = require('event-stream');
const todo = require('gulp-todo');
const imagemin = require('gulp-imagemin');
const rimraf = require('gulp-rimraf');
const semistandard = require('gulp-semistandard');
const livereload = require('gulp-livereload');
const autoprefixer = require('gulp-autoprefixer');
const babelify = require('babelify');

const paths = {
  styles: './public/sass/**/*.scss',
  styleOutputFolder: './public/css/',

  images: './public/img/**/*',

  toCopyIntoPublicBuild: ['./public/fonts/**/*', './public/svg/**/*'],

  video: ['./public/video/**/*'],

  browseryFiles: {
    entryPoints: ['./public/js/main.js'],
    watch: [
      './public/js/**/*.js',
      '!./public/js/*.bundle.js',
      'gulpfile.js'
    ],
    outputPoints: ['./public/js/main.bundle.js']
  },

  semistandard: ['./public/js/**/*.js',
    '!./public/js/*.bundle.js',
    '!./public/js/lib/*.js',
    'gulpfile.js',
    '!node_modules/**'
  ]
};

/**
 *
 * Build & Production Tasks
 *
 */

// clean
gulp.task('clean', () => (
  gulp.src('./public-build', {
    read: false,
    allowEmpty: true
  })
    .pipe(rimraf())
));

// to-do
gulp.task('todo', (cb) => {
  gulp.src(paths.semistandard)
    .pipe(todo({
      verbose: true
    }))
    .pipe(gulp.dest('./'))
    .on('end', cb);
});

// semistandard
gulp.task('semistandard', (cb) => {
  return gulp.src(paths.semistandard)
    .pipe(semistandard())
    .pipe(semistandard.reporter('default', {}));
});

gulp.task('watch:semistandard', () => gulp.watch(paths.semistandard, gulp.series('semistandard')));

// sass
gulp.task('sass', (cb) => {
  gulp.src(paths.styles)
    .pipe(sass()
      .on('error', (e) => {
        gutil.log(e);
      })
      .on('error', sass.logError))
    .pipe(gulp.dest(paths.styleOutputFolder))
    .pipe(livereload())
    .on('end', cb);
});

gulp.task('watch:sass', () => {
  livereload.listen(35729);
  gulp.watch(paths.styles, gulp.series('sass'));
});

// cssnano
gulp.task('cssnano', (cb) => {
  gulp.src(`${paths.styleOutputFolder}*.css`)
    .pipe(cssnano())
    .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest('./public-build/css/'))
    .on('end', cb);
});

// imgoptim
gulp.task('imgoptim', (cb) => {
  gulp.src(paths.images)
    .pipe(imagemin([
      imagemin.gifsicle({interlaced: true}),
      imagemin.jpegtran({progressive: true}),
      imagemin.optipng({optimizationLevel: 5}),
      imagemin.svgo({
        plugins: [
          {removeViewBox: true},
          {cleanupIDs: false}
        ]
      })
    ]))
    .pipe(gulp.dest('./public-build/img/'))
    .on('end', cb);
});

// browserify
gulp.task('browserify', (cb) => {
  const tasks = paths.browseryFiles.entryPoints.map((entry) => browserify({
    entries: [entry],
    debug: true
  })
    .transform(babelify.configure({
      'presets': ['@babel/preset-env']
    }))
    .bundle()
    .on('error', (e) => {
      gutil.log(e);
    })
    .pipe(source(entry))
    .pipe(rename({
      suffix: '.bundle'
    }))

    .pipe(gulp.dest('./')));

  // create a merged stream
  es.merge(tasks)
    .on('end', cb);
});

gulp.task('watch:browserify', () => {
  gulp.watch(paths.browseryFiles.watch, gulp.series('browserify'));
});

// uglify
gulp.task('uglify', (cb) => {
  gulp.src('./public/js/*.bundle.js')
    .pipe(uglify())
    .on('error', function (err) { gutil.log(gutil.colors.red('[Error]'), err.toString()); })
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest('./public-build/js/'))
    .on('end', cb);
});

// copy remaining folders into build
gulp.task('copy', (cb) => {
  return gulp.src(paths.toCopyIntoPublicBuild, { base: 'public' })
    .pipe(gulp.dest('./public-build/'))
    // .pipe(copy('./public-build/'))
    .on('end', cb);
});

// copy video into build
gulp.task('video', (cb) => {
  gulp.src(paths.video)
    .pipe(gulp.dest('./public-build/video'))
    .on('end', cb);
});

// copy remaining folders into build
gulp.task('copy', (cb) => {
 gulp.src(paths.toCopyIntoPublicBuild, {base:"public"})
   .pipe(gulp.dest('./public-build/'))
   .on('end', cb);
});

// gulp.task('watch', ['watch:sass', 'watch:semistandard']);
gulp.task('watch', gulp.parallel('watch:sass', 'watch:semistandard', 'watch:browserify'));

gulp.task('refresh', gulp.series(
  'sass',
  'browserify'
));

gulp.task('production', gulp.series(
  'clean',
  'todo',
  'sass',
  'cssnano',
  'imgoptim',
  'uglify',
  'copy'
));


gulp.task('default', gulp.series(['watch']));
