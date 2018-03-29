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
import resize from "gulp-image-resize";
import fm from "front-matter";

import PostPage from "./lib/PostPage/PostPage.jsx";
import GalleryPage from "./lib/GalleryPage/GalleryPage.jsx";

const paths = {
  css: [
    "./content/**/*.+[scss|css]",
    "./lib/blog-styles.scss",
    "./node_modules/highlight.js/styles/atom-one-light.css"
  ],
  scripts: [
    "./lib/blog-scripts.js",
    "./content/**/*.+(jsx|js)",
  ],
  posts: [
    "./content/@(post|links|about)/**/*.md",
    "./content/index.md"
  ],
  galleries: "./content/@(photos)/**/*.md",
  thumbnails: "./content/@(photos)/**/*.jpg",
  copy: [
    "./content/**/*.!(jsx|js|css|scss|md)",
    "./lib/*.woff2",
    "./lib/favicon.png"
  ],
  dist: "./dist"
};

const getPageType = function(fileName) {
  if (fileName.startsWith("/photos/") != -1) {

  }
  return "post";
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

const posts = () =>
  gulp.src(paths.posts)
  .pipe(change(md => ReactDOMServer.renderToStaticMarkup(<PostPage md={md}/>)))
  .pipe(rename({extname: ".html"}))
  .pipe(gulp.dest(paths.dist));

const galleries = () =>
  gulp.src(paths.galleries)
  .pipe(change(src => {
    const {attributes, body} = fm(src);
    const images = attributes.images.map(({src, aspect}) => ({
      srcFull: src,
      srcThumb: src.replace(".jpg", ".thumb.jpg"),
      aspect
    }));
    return ReactDOMServer.renderToStaticMarkup(
      <GalleryPage type="gallery" images={images} md={body}/>
    );
  }))
  .pipe(rename({extname: ".html"}))
  .pipe(gulp.dest(paths.dist));

const thumbnails = () =>
  gulp.src(paths.thumbnails)
  .pipe(resize({height: 600, upscale: false, sharpen: true, imageMagick: true}))
  .pipe(rename({extname: ".thumb.jpg"}))
  .pipe(gulp.dest(paths.dist));

const copy = () =>
  gulp.src(paths.copy)
  .pipe(gulp.dest(paths.dist));

gulp.task("clean", clean);
gulp.task("styles", styles);
gulp.task("scripts", scripts);
gulp.task("posts", posts);
gulp.task("galleries", galleries);
gulp.task("thumbnails", thumbnails);
gulp.task("copy", copy);
gulp.task("default", gulp.series(clean, gulp.parallel(
  styles,
  scripts,
  posts,
  galleries,
  thumbnails,
  copy
)));
