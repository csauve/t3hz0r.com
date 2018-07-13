import gulp from "gulp";
import transform from "gulp-transform";
import concat from "gulp-concat";
import {sortBy, reverse} from "ramda";
import rename from "gulp-rename";
import {buildStyles, buildScripts, buildClean, buildCopy} from "t3h-ui/lib/gulp-jobs.js";
import {renderDocStatic} from "t3h-ui/lib/server.js";
import BlogPage from "./lib/BlogPage/BlogPage.jsx";
import HomePage from "./lib/HomePage/HomePage.jsx";
import {parseBlogPage} from "./lib/common/pageParser.js";

const paths = {
  //stylesheets which are sass-processed and minified
  styles: [
    "./content/**/*.+[scss|css]",
    "./lib/blog-styles.scss",
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
  //posts which should be indexed
  indexed: [
    "./content/+(post)/**/index.md"
  ],
  indexName: "index.html",
  //assets which are just copied without modification
  copy: [
    "./content/**/*.!(jsx|js|css|scss|md)",
    "./node_modules/t3h-ui/lib/+(t3h-assets)/**/*",
    "./node_modules/highlight.js/styles/atom-one-light.css",
    "./node_modules/+(katex)/dist/katex.min.css",
    "./node_modules/+(katex)/dist/fonts/*",
  ],
  //where all output files end up
  dist: "./dist"
};

const pages = () =>
  gulp.src(paths.pages)
  .pipe(rename({extname: ".html"}))
  .pipe(transform("utf-8", (content, file) => {
    const page = parseBlogPage(content, file.relative);
    return renderDocStatic(BlogPage, page);
  }))
  .pipe(gulp.dest(paths.dist));

const indexes = () =>
  gulp.src(paths.indexed)
  .pipe(rename({extname: ".html"}))
  .pipe(transform("utf-8", (content, file) => {
    const page = parseBlogPage(content, file.relative);
    return JSON.stringify(page);
  }))
  .pipe(concat(paths.indexName, {newLine: ","}))
  .pipe(transform("utf-8", (content, file) => {
    const posts = reverse(sortBy(
      post => post.meta.dateIso,
      JSON.parse(`[${content}]`)
    ));
    return renderDocStatic(HomePage, {posts});
  }))
  .pipe(gulp.dest(paths.dist));

gulp.task("clean", buildClean(paths.dist));
gulp.task("styles", buildStyles(paths.styles, paths.dist));
gulp.task("scripts", buildScripts(paths.scripts, paths.dist));
gulp.task("copy", buildCopy(paths.copy, paths.dist));
gulp.task("pages", pages);
gulp.task("indexes", indexes);
gulp.task("default", gulp.series("clean", gulp.parallel(
  "styles",
  "scripts",
  "pages",
  "indexes",
  "copy"
)));
