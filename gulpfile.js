var gulp = require("gulp"),
    typescript = require("gulp-typescript"),
    small = require("small"),
    sourcemaps = require("gulp-sourcemaps"),
    merge = require("merge2"),
    concat = require("gulp-concat"),
    uglify = require("gulp-uglify");

var tsServer = typescript.createProject("lib/tsconfig.json");
var tsClient = typescript.createProject("lib/tsconfig.json", {
    target: "es5"
});


gulp.task("compile-client", () => {
    return gulp.src(["lib/client/**/*.ts", "lib/shared/**/*.ts"], {
            base: "lib"
        }).pipe(sourcemaps.init())
        .pipe(tsClient())
        .pipe(small('client/index.js', {
            outputFileName: {standalone: "scripts.js"},
            extenalResolve: ['node_modules'],
            globalModules: {
                "crypto": {
                    standalone: "undefined"
                }
            }
        })).pipe(sourcemaps.write("."))
           .pipe(gulp.dest("dist"));
});

gulp.task("compile-server", () => {
    return gulp.src(["lib/server/**/*.ts", "lib/shared/**/*.ts"], {
            base: "lib"
        }).pipe(sourcemaps.init())
        .pipe(tsServer())
        .pipe(sourcemaps.write("."))
        .pipe(gulp.dest("dist"));
});

gulp.task("release", ["compile-client", "compile-server"], () => {
    return gulp.src("static/scripts/scripts.js")
               .pipe(uglify())
               .pipe(gulp.dest("static/scripts"));
});

gulp.task("default", ["compile-client", "compile-server"]);