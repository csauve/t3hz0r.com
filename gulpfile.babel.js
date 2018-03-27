import del from "del";
import gulp from "gulp";
import babel from "gulp-babel";
import sass from "gulp-sass";
import browserify from "gulp-browserify";
import babelify from "babelify";
import change from "gulp-change";
import React from "react";
import ReactDOMServer from "react-dom/server";
import rename from "gulp-rename";

import BlogPage from "./lib/BlogPage/BlogPage.jsx";

const paths = {
  css: ["./content/**/*.+[scss|css]", "./lib/blog-styles.scss", "./node_modules/highlight.js/styles/atom-one-light.css"],
  scripts: "./content/**/*.+(jsx|js)",
  pages: "./content/**/*.md",
  copy: ["./content/**/*.!(jsx|js|css|scss|md)", "./lib/*.woff2", "./lib/favicon.png"],
  dist: "./dist"
};

//start fresh!
const clean = () => del("./dist");

//build distributable CSS
const styles = () =>
  gulp.src(paths.css)
  .pipe(sass())
  .pipe(gulp.dest(paths.dist));

//build distributable script bundles
const scripts = () =>
  gulp.src(paths.scripts)
  .pipe(browserify({
    extensions: [".js", ".jsx"],
    transform: [babelify]
  }))
  .pipe(gulp.dest(paths.dist));

const pages = () =>
  gulp.src(paths.pages)
  .pipe(change((md) =>
    ReactDOMServer.renderToStaticMarkup(<BlogPage md={md}/>)
  ))
  .pipe(rename({extname: ".html"}))
  .pipe(gulp.dest(paths.dist));

const copy = () =>
  gulp.src(paths.copy)
  .pipe(gulp.dest(paths.dist));

gulp.task("clean", clean);
gulp.task("styles", styles);
gulp.task("scripts", scripts);
gulp.task("pages", pages);
gulp.task("copy", copy);
gulp.task("default", gulp.series(clean, gulp.parallel(styles, scripts, pages, copy)));
