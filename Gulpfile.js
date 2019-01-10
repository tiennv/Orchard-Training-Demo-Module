// There are multiple ways of managing your resources (including scripts, stylesheets, images etc.). OrchardCore itself
// provide its own pipeline for it using an Assets.json file. We don't use it this time but check the
// http://docs.orchardproject.net/en/latest/Documentation/Processing-client-side-assets/ documentation for more
// information.

// Here you will see a standalone Gulpfile for copying third-party resources from the node_modules folder to wwwroot
// folder and also compiling our own resources (styles and scripts) and moving the resoults to the wwwroot folder as
// well.

const gulp = require("gulp");
// Gulp plugin used for compiling sass files.
const sass = require("gulp-sass");
// Minifies css files.
const cssnano = require('gulp-cssnano');
// Renames the file so the result will have a different name (i.e. .min.css or .min.js).
const rename = require("gulp-rename");
// Cache the result so the task won't be fully executed if it is not necessary.
const cached = require("gulp-cached");
// Gulp watcher if needed when we are actively developing a resource.
const watch = require("gulp-watch");

const imageFiles = "./Assets/Images/**/*";
const imageFilesDestination = "./wwwroot/Images";

const pickrFiles = "./node_modules/pickr-widget/dist/*";
const pickrFilesDestination = "./wwwroot/Pickr";

const sassFiles = "./Assets/Styles/**/*.scss";
const cssFiles = "./wwwroot/Styles/**/*.css";
const stylingFilesDestination = "./wwwroot/Styles";

// This task will collect all the images and move it to the wwwroot folder.
gulp.task("images", function () {
    return gulp
        .src(imageFiles)
        .pipe(cached("images"))
        .pipe(gulp.dest(imageFilesDestination));
});

// Task specifically created for our third-party plugin, pickr. It will just copy the files to the wwwroot folder.
gulp.task("pickr", function () {
    return gulp
        .src(pickrFiles)
        .pipe(cached("pickr"))
        .pipe(gulp.dest(pickrFilesDestination));
});

// It will compile our sass files to css.
gulp.task("sass:compile", function (callback) {
    gulp.src(sassFiles)
        .pipe(cached("scss"))
        .pipe(sass({ linefeed: "crlf" })).on("error", sass.logError)
        .pipe(gulp.dest(stylingFilesDestination))
        .on("end", callback);
});

// It will minify our css files and renames them to contain the .min.css suffix.
gulp.task("sass:minify", ["sass:compile"], function () {
    return gulp.src(cssFiles)
        .pipe(cached("css"))
        .pipe(cssnano())
        .pipe(rename({ suffix: ".min" }))
        .pipe(gulp.dest(stylingFilesDestination));
});

gulp.task("default", ["images", "pickr", "sass:minify"]);

gulp.task("sass:watch", function () {
    watch(sassFiles, function () {
        gulp.start("sass:minify");
    });
});

// NEXT STATION: Lombiq.TrainingDemo.csproj and find the target with the "NpmInstall" name.