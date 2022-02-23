const path = require("path");
const fs = require("fs");
const gulp = require("gulp");
const RSS = require("rss");
const del = require("del");
const {sortBy, reverse} = require("ramda");
const sass = require("sass");
const uglify = require("gulp-uglify");
const express = require("express");
const serveStatic = require("serve-static");
const transform = require("gulp-transform");
const concat = require("gulp-concat");
const rename = require("gulp-rename");
const {parsePage, renderPage} = require("./src/render");
const post = require("./src/render/templates/post");
const crypto = require("crypto");

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
  sassEntry: "./src/content/assets/blog.scss",
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
  return new Promise((resolve, reject) => {
   sass.render({file: paths.sassEntry, outputStyle: "compressed"}, (err, res) => {
     if (err) {
       reject(err);
     } else {
       const outDir = path.join(paths.dist, "assets");
       if (!fs.existsSync(outDir)) {
         fs.mkdirSync(outDir, {recursive: true});
       }
       fs.writeFileSync(path.join(outDir, "blog.css"), res.css, "utf8");
       resolve();
     }
   });
 });
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

function buildRss() {
  return gulp.src(paths.pages)
    .pipe(transform("utf8", (content, file) => {
      const page = parsePage(content, file.relative);
      const item = {
        title: page.title,
        url: `https://t3hz0r.com/${page.path}`,
        guid: crypto.createHash("sha256").update(page.path).digest("base64"),
        date: page.dateIso
      };
      return JSON.stringify(item);
    }))
    .pipe(concat("rss.xml", {newLine: ","}))
    .pipe(transform("utf-8", (content, file) => {
      const items = reverse(
        sortBy(
          item => item.dateIso,
          JSON.parse(`[${content}]`)
        )
      );
      const feed = new RSS({
        title: "t3hz0r.com",
        description: "Hypertext, delivered fresh. Personal blog of Connor Sauve, with topics on software, photography, art, and gaming.",
        feed_url: "https://t3hz0r.com/rss.xml",
        site_url: "https://t3hz0r.com",
        managingEditor: "Connor Sauve <contact@t3hz0r.com>",
        webMaster: "Connor Sauve <contact@t3hz0r.com>",
        copyright: "Licensed CC BY-NC 4.0",
        language: "en-ca",
        categories: [
          "Software",
          "Blog",
          "Gaming",
          "Technology"
        ],
        pubDate: new Date(),
        ttl: 720
      });
      for (const item of items) {
        feed.item(item);
      }
      return feed.xml({indent: true});
    }))
    .pipe(gulp.dest(paths.dist));
}

const build = gulp.series(clean, gulp.parallel(
  copyStatic,
  buildSassAssets,
  buildPages,
  buildRss,
  buildJsAssets,
));

function watch() {
  gulp.watch(paths.staticFiles, copyStatic);
  gulp.watch(paths.sassAssets, buildSassAssets);
  gulp.watch(paths.jsAssets, buildJsAssets);
  gulp.watch(paths.pages, gulp.series(buildPages, buildRss));
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
