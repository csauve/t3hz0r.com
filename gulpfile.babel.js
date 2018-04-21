import gulp from "gulp";
import change from "gulp-change";
import rename from "gulp-rename";
import fm from "front-matter";
import {buildStyles, buildScripts, buildClean, buildCopy} from "t3h-ui/lib/gulp-jobs.js";
import {renderDocStatic} from "t3h-ui/lib/server.js";
import BlogPage from "./lib/BlogPage/BlogPage.jsx";

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
  .pipe(change(src => {
    const {attributes, body} = fm(src);
    return renderDocStatic(BlogPage, {meta: attributes, md: body});
  }))
  .pipe(rename({extname: ".html"}))
  .pipe(gulp.dest(paths.dist));

gulp.task("clean", buildClean(paths.dist));
gulp.task("styles", buildStyles(paths.styles, paths.dist));
gulp.task("scripts", buildScripts(paths.scripts, paths.dist));
gulp.task("copy", buildCopy(paths.copy, paths.dist));
gulp.task("pages", pages);
gulp.task("default", gulp.series("clean", gulp.parallel(
  "styles",
  "scripts",
  "pages",
  "copy"
)));
