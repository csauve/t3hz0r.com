import gulp from "gulp";
import del from "del";
import babel from "gulp-babel";
import uglify from "gulp-uglify";
import sass from "gulp-sass";
import cleanCSS from "gulp-clean-css";
import browserify from "gulp-browserify";
import babelify from "babelify";
import change from "gulp-change";
import React from "react";
import ReactDOMServer from "react-dom/server";
import rename from "gulp-rename";
import fm from "front-matter";

import BlogPage from "./lib/BlogPage/BlogPage.jsx";

const paths = {
  //stylesheets which are sass-processed and minified
  styles: [
    "./content/**/*.+[scss|css]",
    "./lib/blog-styles.scss",
    "./node_modules/highlight.js/styles/atom-one-light.css",
    "./node_modules/normalize.css/normalize.css"
  ],
  //scripts which are transpiled, bundled, and minified
  scripts: [
    "./lib/blog-scripts.js",
    "./content/**/*.+(jsx|js)",
  ],
  //markdown which are rendered to HTML pages
  pages: [
    "./content/**/*.md"
  ],
  //assets which are just copied without modification
  copy: [
    "./content/**/*.!(jsx|js|css|scss|md)",
    "./lib/*.woff2",
    "./lib/favicon.png"
  ],
  //where all output files end up
  dist: "./dist"
};

//start fresh!
const clean = () => del("./dist");

//build distributable CSS
const styles = () =>
  gulp.src(paths.styles)
  .pipe(sass())
  .pipe(cleanCSS({compatibility: "ie8"}))
  .pipe(gulp.dest(paths.dist));

//build distributable script bundles
const scripts = () =>
  gulp.src(paths.scripts)
  .pipe(browserify({
    extensions: [".js", ".jsx"],
    transform: [babelify]
  }))
  .pipe(uglify())
  .pipe(rename({extname: ".js"}))
  .pipe(gulp.dest(paths.dist));

const pages = () =>
  gulp.src(paths.pages)
  .pipe(change(src => {
    const {attributes, body} = fm(src);
    return ReactDOMServer.renderToStaticMarkup(
      <BlogPage meta={attributes} md={body}/>
    );
  }))
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
gulp.task("default", gulp.series(clean, gulp.parallel(
  styles,
  scripts,
  pages,
  copy
)));
