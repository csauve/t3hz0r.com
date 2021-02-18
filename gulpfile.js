const gulp = require("gulp");
const del = require("del");
const sass = require("gulp-sass");
const uglify = require("gulp-uglify");
const express = require("express");
const serveStatic = require("serve-static");
const transform = require("gulp-transform");
const rename = require("gulp-rename");
const {parsePage, renderPage} = require("./src/render");

const paths = {
  //where all output files end up
  dist: "./dist",
  //assets which are just copied without modification
  staticFiles: [
    "./src/content/**/*.!(jsx|js|css|scss|md)",
    "./node_modules/highlight.js/styles/atom-one-light.css",
    "./node_modules/feather-icons/dist/feather-sprite.svg",
    "./node_modules/three/build/three.min.js",
    // "./node_modules/+(katex)/dist/katex.min.css",
    // "./node_modules/+(katex)/dist/fonts/*",
  ],
  jsAssets: [
    "./src/content/**/*.js",
  ],
  sassAssets: [
    "./src/content/**/*.scss",
  ],
  pages: [
    "./src/content/**/*.md",
  ],
  rebuild: [
    "./src/render/**/*.js",
  ]
};

function clean() {
  return del(paths.dist);
}

function copyStatic() {
  return gulp.src(paths.staticFiles)
    .pipe(gulp.dest(paths.dist));
}

function buildSassAssets() {
  return gulp.src(paths.sassAssets)
    .pipe(sass())
    .pipe(gulp.dest(paths.dist));
}

function buildJsAssets() {
  return gulp.src(paths.jsAssets)
    .pipe(uglify())
    .pipe(gulp.dest(paths.dist));
}

function buildPages() {
  return gulp.src(paths.pages)
    .pipe(rename({extname: ".html"}))
    .pipe(transform("utf-8", (content, file) => {
      const page = parsePage(content, file.relative);
      return renderPage(page);
    }))
    .pipe(gulp.dest(paths.dist));
}

const build = gulp.series(clean, gulp.parallel(
  copyStatic,
  buildSassAssets,
  buildPages,
  buildJsAssets,
));

function watch() {
  gulp.watch(paths.staticFiles, copyStatic);
  gulp.watch(paths.sassAssets, buildSassAssets);
  gulp.watch(paths.jsAssets, buildJsAssets);
  gulp.watch(paths.pages, buildPages);
  gulp.watch(paths.rebuild, build);
  const app = express();
  app.use("/", serveStatic("./dist"));
  app.listen(8080);
  console.log(`Serving at http://localhost:8080/`);
}

module.exports = {
  dev: gulp.series(build, watch),
  default: build
};

//-----------------------

// import concat from "gulp-concat";
// import RSS from "rss";
// import {sortBy, reverse, compose} from "ramda";
// import {buildStyles, buildScripts, buildClean, buildCopy} from "t3h-ui/lib/utils/gulp-helpers.js";
// import {renderDocStatic} from "t3h-ui/lib/utils/ssr.js";
// import {parseBlogPage} from "./lib/common/pageParser.js";
// import PostPage from "./lib/components/PostPage.jsx";
// import HomePage from "./lib/components/HomePage.jsx";
// import crypto from "crypto";
//
// const paths = {
//   //stylesheets which are sass-processed and minified
//   styles: [
//     "./content/**/*.+[scss|css]",
//     "./lib/blog-bundle.scss",
//   ],
//   //scripts which are transpiled, bundled, and minified
//   scripts: [
//     "./lib/blog-bundle.js",
//     "./content/**/*.+(jsx|js)",
//   ],
//   //markdown which are rendered to HTML pages
//   pages: [
//     "./content/**/*.md"
//   ],
//   indexed: [
//     "./content/+(post)/**/index.md"
//   ],
//   indexName: "index.html",
//   rssName: "rss.xml",
//   //assets which are just copied without modification
//   copy: [
//     "./content/**/*.!(jsx|js|css|scss|md)",
//     "./node_modules/t3h-ui/+(t3h-assets)/**/*",
//     "./node_modules/highlight.js/styles/atom-one-light.css",
//     "./node_modules/+(katex)/dist/katex.min.css",
//     "./node_modules/+(katex)/dist/fonts/*",
//   ],
//   //where all output files end up
//   dist: "./dist"
// };
//
// const buildRss = (posts) => {
//   const feed = new RSS({
//     title: "t3hz0r.com",
//     description: "Hypertext, delivered fresh. Personal blog of Connor Sauve, with topics on software, photography, art, and gaming.",
//     feed_url: "https://t3hz0r.com/rss.xml",
//     site_url: "https://t3hz0r.com",
//     managingEditor: "Connor Sauve <contact@t3hz0r.com>",
//     webMaster: "Connor Sauve <contact@t3hz0r.com>",
//     copyright: "Licensed CC BY-NC 4.0",
//     language: "en-ca",
//     categories: [
//       "Software",
//       "Blog",
//       "Gaming",
//       "Technology"
//     ],
//     pubDate: new Date(),
//     ttl: 720
//   });
//   for (let post of posts) {
//     feed.item({
//       title: post.title,
//       url: `https://t3hz0r.com/${post.path}`,
//       guid: crypto.createHash("sha256").update(post.path).digest("base64"),
//       date: post.dateIso
//     });
//   }
//   return feed.xml({indent: true});
// };
//
// //const pages = () => {
// //  const allPagesJson = gulp.src(paths.pages)
// //    .pipe(rename({extname: ".html"}))
// //    .pipe(transform("utf-8", (content, file) => {
// //      const page = parseBlogPage(content, file.relative);
// //      return JSON.stringify(page);
// //    }))
// //    .pipe(concat("index.json", {newLine: ","}))
// //    .pipe(transform("utf-8", (content, file) => {
// //      return `[${content}]`;
// //    }));
// //};
//
// //todo: replace
// const pages = () =>
//   gulp.src(paths.pages)
//   .pipe(rename({extname: ".html"}))
//   .pipe(transform("utf-8", (content, file) => {
//     const page = parseBlogPage(content, file.relative);
//     return renderDocStatic(PostPage, page);
//   }))
//   .pipe(gulp.dest(paths.dist));
//
// //todo: replace
// const rss = () =>
//   gulp.src(paths.indexed)
//   .pipe(rename({extname: ".html"}))
//   .pipe(transform("utf-8", (content, file) => {
//     const page = parseBlogPage(content, file.relative);
//     return JSON.stringify(page);
//   }))
//   .pipe(concat("index.json", {newLine: ","}))
//   .pipe(transform("utf-8", (content, file) => {
//     return `[${content}]`;
//   }))
//   .pipe(rename(paths.rssName))
//   .pipe(transform("utf-8", (content, file) => {
//     return compose(
//       posts => buildRss(posts),
//       reverse,
//       sortBy(post => post.meta.dateIso),
//       json => JSON.parse(json)
//     )(content);
//   }))
//   .pipe(gulp.dest(paths.dist));
//
// //todo: replace
// const index = () =>
//   gulp.src(paths.indexed)
//   .pipe(rename({extname: ".html"}))
//   .pipe(transform("utf-8", (content, file) => {
//     const page = parseBlogPage(content, file.relative);
//     return JSON.stringify(page);
//   }))
//   .pipe(concat("index.json", {newLine: ","}))
//   .pipe(transform("utf-8", (content, file) => {
//     return `[${content}]`;
//   }))
//   .pipe(rename(paths.indexName))
//   .pipe(transform("utf-8", (content, file) => {
//     return compose(
//       posts => renderDocStatic(HomePage, {posts}),
//       reverse,
//       sortBy(post => post.meta.dateIso),
//       json => JSON.parse(json)
//     )(content);
//   }))
//   .pipe(gulp.dest(paths.dist));
//
// gulp.task("clean", buildClean(paths.dist));
// gulp.task("styles", buildStyles(paths.styles, paths.dist));
// gulp.task("scripts", buildScripts(paths.scripts, paths.dist));
// gulp.task("copy", buildCopy(paths.copy, paths.dist));
// gulp.task("pages", pages);
// gulp.task("index", index);
// gulp.task("rss", rss);
// gulp.task("default", gulp.series("clean", gulp.parallel(
//   "styles",
//   "scripts",
//   "pages",
//   "index",
//   "rss",
//   "copy"
// )));
