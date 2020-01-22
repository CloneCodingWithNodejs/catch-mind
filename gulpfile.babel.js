/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable import/prefer-default-export */
import gulp from 'gulp';
import sass from 'gulp-sass';
import autoprefixer from 'gulp-autoprefixer';
import minifyCSS from 'gulp-csso';
import del from 'del';
import browserify from 'gulp-browserify';
import babel from 'babelify';

sass.compiler = require('node-sass');

const paths = {
  styles: {
    src: 'src/assets/scss/styles.scss',
    dest: 'src/static/styles',
    watch: 'src/assets/scss/**/*.scss'
  },
  js: {
    src: 'src/assets/js/main.js',
    dest: 'src/static/js',
    watch: 'src/assets/js/**/*.js'
  }
};

const styles = () =>
  gulp
    .src(paths.styles.src)
    .pipe(sass())
    .pipe(
      autoprefixer({
        cascade: false
      })
    )
    .pipe(minifyCSS())
    .pipe(gulp.dest(paths.styles.dest));

const js = () =>
  gulp
    .src(paths.js.src)
    .pipe(
      browserify({
        transform: [babel.configure({ presets: ['@babel/preset-env'] })]
      })
    )
    .pipe(gulp.dest(paths.js.dest));

const watchFiles = () => {
  gulp.watch(paths.styles.watch, styles);
  gulp.watch(paths.js.watch, js);
};

const clean = () => del(['src/static/js', 'src/static/styles']);

const dev = gulp.series([clean, styles, js]);

// 배포용
const build = gulp.series([clean, styles, js]);

export default dev;
