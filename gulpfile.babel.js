import gulp from "gulp";
import transform from "gulp-transform";
import concat from "gulp-concat";
import RSS from "rss";
import {sortBy, reverse, compose} from "ramda";
import rename from "gulp-rename";
import {buildStyles, buildScripts, buildClean, buildCopy} from "t3h-ui/lib/utils/gulp-helpers.js";
import {renderDocStatic} from "t3h-ui/lib/utils/ssr.js";
import PostPage from "./lib/components/PostPage.jsx";
import HomePage from "./lib/components/HomePage.jsx";
import {parseBlogPage} from "./lib/common/pageParser.js";
import crypto from "crypto";

const paths = {
  //stylesheets which are sass-processed and minified
  styles: [
    "./content/**/*.+[scss|css]",
    "./lib/blog-bundle.scss",
  ],
  //scripts which are transpiled, bundled, and minified
  scripts: [
    "./lib/blog-bundle.js",
    "./content/**/*.+(jsx|js)",
  ],
  //markdown which are rendered to HTML pages
  pages: [
    "./content/**/*.md"
  ],
  indexed: [
    "./content/+(post)/**/index.md"
  ],
  indexName: "index.html",
  rssName: "rss.xml",
  //assets which are just copied without modification
  copy: [
    "./content/**/*.!(jsx|js|css|scss|md)",
    "./node_modules/t3h-ui/+(t3h-assets)/**/*",
    "./node_modules/highlight.js/styles/atom-one-light.css",
    "./node_modules/+(katex)/dist/katex.min.css",
    "./node_modules/+(katex)/dist/fonts/*",
  ],
  //where all output files end up
  dist: "./dist"
};

const buildRss = (posts) => {
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
  for (let post of posts) {
    feed.item({
      title: post.title,
      url: `https://t3hz0r.com/${post.path}`,
      guid: crypto.createHash("sha256").update(post.path).digest("base64"),
      date: post.dateIso
    });
  }
  return feed.xml({indent: true});
};

//const pages = () => {
//  const allPagesJson = gulp.src(paths.pages)
//    .pipe(rename({extname: ".html"}))
//    .pipe(transform("utf-8", (content, file) => {
//      const page = parseBlogPage(content, file.relative);
//      return JSON.stringify(page);
//    }))
//    .pipe(concat("index.json", {newLine: ","}))
//    .pipe(transform("utf-8", (content, file) => {
//      return `[${content}]`;
//    }));
//};

//todo: replace
const pages = () =>
  gulp.src(paths.pages)
  .pipe(rename({extname: ".html"}))
  .pipe(transform("utf-8", (content, file) => {
    const page = parseBlogPage(content, file.relative);
    return renderDocStatic(PostPage, page);
  }))
  .pipe(gulp.dest(paths.dist));

//todo: replace
const rss = () =>
  gulp.src(paths.indexed)
  .pipe(rename({extname: ".html"}))
  .pipe(transform("utf-8", (content, file) => {
    const page = parseBlogPage(content, file.relative);
    return JSON.stringify(page);
  }))
  .pipe(concat("index.json", {newLine: ","}))
  .pipe(transform("utf-8", (content, file) => {
    return `[${content}]`;
  }))
  .pipe(rename(paths.rssName))
  .pipe(transform("utf-8", (content, file) => {
    return compose(
      posts => buildRss(posts),
      reverse,
      sortBy(post => post.meta.dateIso),
      json => JSON.parse(json)
    )(content);
  }))
  .pipe(gulp.dest(paths.dist));

//todo: replace
const index = () =>
  gulp.src(paths.indexed)
  .pipe(rename({extname: ".html"}))
  .pipe(transform("utf-8", (content, file) => {
    const page = parseBlogPage(content, file.relative);
    return JSON.stringify(page);
  }))
  .pipe(concat("index.json", {newLine: ","}))
  .pipe(transform("utf-8", (content, file) => {
    return `[${content}]`;
  }))
  .pipe(rename(paths.indexName))
  .pipe(transform("utf-8", (content, file) => {
    return compose(
      posts => renderDocStatic(HomePage, {posts}),
      reverse,
      sortBy(post => post.meta.dateIso),
      json => JSON.parse(json)
    )(content);
  }))
  .pipe(gulp.dest(paths.dist));

gulp.task("clean", buildClean(paths.dist));
gulp.task("styles", buildStyles(paths.styles, paths.dist));
gulp.task("scripts", buildScripts(paths.scripts, paths.dist));
gulp.task("copy", buildCopy(paths.copy, paths.dist));
gulp.task("pages", pages);
gulp.task("index", index);
gulp.task("rss", rss);
gulp.task("default", gulp.series("clean", gulp.parallel(
  "styles",
  "scripts",
  "pages",
  "index",
  "rss",
  "copy"
)));
