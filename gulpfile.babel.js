import gulp from 'gulp';
import sass from 'gulp-sass';
import browserSync from 'browser-sync';
import cleanCSS from 'gulp-clean-css';
import autoprefixer from 'gulp-autoprefixer';
import sourcemaps from 'gulp-sourcemaps';

const dirs = {
    src: 'src',
    dest: 'build'
};
gulp.task('browser-sync', function () {
    browserSync({
        server: {
            baseDir: 'app'
        },
        notify: false,
    });
});
gulp.task('sass', function () {
    return gulp.src('app/sass/**/*.sass')
        .pipe(sass({outputStyle: 'expand'}))
        .pipe(autoprefixer(['last 3 versions']))
        .pipe(cleanCSS())
        .pipe(gulp.dest('app/css'))
        .pipe(browserSync.reload({stream: true}));
});
gulp.task('fonts', function () {
    return gulp.src('app/fonts/**/*')
        .pipe(gulp.dest('dist/fonts'))
});
gulp.task('watch', ['sass', 'browser-sync', 'fonts'], function () {
    gulp.watch('app/sass/**/*.sass', ['sass']);
    gulp.watch('app/fonts/**/*.ttf', ['fonts']);
    gulp.watch('app/js/**/*.js', ['js']);
    gulp.watch('app/**/*.html', browserSync.reload);
});
gulp.task('js', function () {
    return gulp.src('app/js/**/*')
        .pipe(gulp.dest('dist/js'))
});
gulp.task('build', [`sass`, `fonts`], function () {
    let buildFiles = gulp.src([
        'app/*.html',
        'app/.htaccess',
    ]).pipe(gulp.dest('./'));
    let buildJs = gulp.src([
        'app/js/**/*'
    ]).pipe(gulp.dest('js'));
    let buildCss = gulp.src([
        'app/css/main.css',
    ]).pipe(gulp.dest('css'));
    let buildAssets = gulp.src([
        'app/assets/**/*',
    ]).pipe(gulp.dest('assets'));
    let buildFonts = gulp.src([
        'app/fonts/!**!/!*',
    ]).pipe(gulp.dest('fonts'));

});

gulp.task('default', ['watch']);