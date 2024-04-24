import gulp from "gulp";
import plumber from "gulp-plumber";
import sass from "gulp-dart-sass";
import postcss from "gulp-postcss";
import csso from "postcss-csso";
import rename from "gulp-rename";
import autoprefixer from "autoprefixer";
import browser from "browser-sync";
import htmlmin from "gulp-htmlmin";
import {deleteAsync} from "del";
import terser from "gulp-terser";
import squoosh from "gulp-libsquoosh";
import svgo from "gulp-svgmin";
import svgstore from "gulp-svgstore";

// Styles

export const styles = () => {
  return gulp.src('source/sass/style.scss', { sourcemaps: true} ) // берет файл style.scss
    .pipe(plumber()) // проверяет ошибки синтаксиса
    .pipe(sass()) // создает css-файл
    .pipe(postcss([
        autoprefixer(), // добавляет вендорные префиксы
        csso() // минифицирует css
    ]))
    .pipe(rename('style.min.css')) // переименовывает в min.css
    .pipe(gulp.dest('build/css', { sourcemaps: '.' })) // помещает его и карту в build
    .pipe(browser.stream()); // обновляет браузер
}

// HTML

export const html = () => {
  return gulp.src('source/*.html')
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest('build'));
}

// Scripts

export const scripts = () => {
  return gulp.src('source/js/**/*.js')
    .pipe(terser())
    .pipe(gulp.dest('build/js'));
}

// Images

export const optimiseImages = () => {
  return gulp.src('source/img/**/*.{jpg,png}')
    .pipe(squoosh())
    .pipe(gulp.dest('build/img'));
}

export const copyImages = () => {
  return gulp.src('source/img/**/*.{jpg,png}')
    .pipe(gulp.dest('build/img'));
}

// Webp

export const createWebp = () => {
  return gulp.src(['source/img/**/*.{jpg,png}', '!source/img/favicons/*.png'])
    .pipe(squoosh({
      webp: {},
    }))
    .pipe(gulp.dest('build/img'));
}

// Svg

export const svgoptimise = () => {
  return gulp.src('source/img/*.svg')
    .pipe(svgo())
    .pipe(gulp.dest('build/img'));
}

export const sprite = () => {
  return gulp.src('source/img/sprite/*.svg')
    .pipe(svgo())
    .pipe(svgstore({
      inlineSvg: true
    }))
    .pipe(rename('sprite.svg'))
    .pipe(gulp.dest('build/img'));
}

// Copy

export const copy = (done) => {
  return gulp.src(['source/fonts/**/*.{woff,woff2}', 'source//*.ico', 'source/*.webmanifest'], { base: 'source' })
    .pipe(gulp.dest('build'));
  done();
}

// Clean

export const clean = () => {
  return deleteAsync('build');
}

// Server

export const server = (done) => {
  browser.init({
    server: {
      baseDir: 'build'
    },
    cors: true,
    notify: false,
    ui: false,
    host: "10.0.0.4", // адрес хоста можно не прописывать, тогда будет назначен произвольный
  });
  done();
}

// Reload

export const reload = (done) => {
  browser.reload();
  done();
}

// Watcher

export const watcher = () => {
  gulp.watch('source/sass/**/*.scss', gulp.series(styles));
  gulp.watch('source/js/**/*.js', gulp.series(scripts));
  gulp.watch('source/*.html', gulp.series(html, reload));
}

// Build

export const build = gulp.series(
  clean,
  copy,
  optimiseImages,
  gulp.parallel(
    styles,
    html,
    scripts,
    svgoptimise,
    sprite,
    createWebp
  ),
);

// Default

export default gulp.series(
  clean,
  copy,
  copyImages,
  gulp.parallel(
    styles,
    html,
    scripts,
    svgoptimise,
    sprite,
    createWebp
  ),
  gulp.series(
    server,
    watcher
  )
);
