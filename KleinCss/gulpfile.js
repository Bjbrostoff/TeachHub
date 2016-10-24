/**
 * Created by apple on 15/12/16.
 */
// 引入 gulp
var gulp = require('gulp');




// 引入组件
var htmlmin = require('gulp-htmlmin'), //html压缩
    imagemin = require('gulp-imagemin'),//图片压缩
    pngcrush = require('imagemin-pngcrush'),
    minifycss = require('gulp-minify-css'),//css压缩

    uglify = require('gulp-uglify'),//js压缩
    concat = require('gulp-concat'),//文件合并
    rename = require('gulp-rename'),//文件更名
    notify = require('gulp-notify');//提示信息

var nodemon = require('gulp-nodemon');
var livereload = require('gulp-livereload');

var paths = {
    client:[
        'public/javascripts/**',
        'public/stylesheets/**'
    ],
    server:{
        index:'./bin/www'
    }
}

//
var nodemonConfig = {
    script:paths.server.index,
    ignore:[
        "public/**",
        "views/**"
    ],
    env:{
        "NODE_ENV":"development"
    }
};

gulp.task('server', ['livereload'], function(){
    return nodemon(nodemonConfig);
});

gulp.task('livereload', function(){
    livereload.listen();
    var server = livereload();

    return gulp.watch(paths.client);
});

// 压缩html
gulp.task('html', function() {
    return gulp.src('src/*.html')
        .pipe(htmlmin({collapseWhitespace: true}))
        .pipe(gulp.dest('./dest'))
        .pipe(notify({ message: 'html task ok' }));

});

// 压缩图片
gulp.task('img', function() {
    return gulp.src('src/images/*')
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngcrush()]
        }))
        .pipe(gulp.dest('./dest/images/'))
        .pipe(notify({ message: 'img task ok' }));
});

// 合并、压缩、重命名css
gulp.task('css', function() {
    return gulp.src('src/css/*.css')
        .pipe(concat('main.css'))
        .pipe(gulp.dest('dest/css'))
        .pipe(rename({ suffix: '.min' }))
        .pipe(minifycss())
        .pipe(gulp.dest('dest/css'))
        .pipe(notify({ message: 'css task ok' }));
});

// 合并、压缩js文件
//user center
gulp.task('js-user_center', function(){
    return gulp.src(['public/app/usercenter/*.js', 'public/app/usercenter/**/*.js'])
        .pipe(concat('ucmain.js'))
        .pipe(gulp.dest('public/app/usercenter'))
        .pipe(rename({suffix:'.min'}))
        .pipe(uglify())
        .pipe(gulp.dest('public/app/usercenter'))
        .pipe(notify({ message: 'js-user_center task ok' }));
})

gulp.task('default', ['server', 'livereload']);