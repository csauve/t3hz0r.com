import React from "react";
import {StandardPage} from "t3h-ui/lib/components.js";
import {renderMd, findHeader} from "../common/markdown.js";

const navContent = (
  <ul>
    <li><a href="/">index</a></li>
    <li><a href="https://github.com/csauve?tab=repositories">code</a></li>
    <li><a href="https://www.flickr.com/photos/csauve/">photos</a></li>
    <li><a href="/links">links</a></li>
    <li><a href="/about">about</a></li>
  </ul>
);

const headerTitle = (
  <a id="home-link" href="/">
    <span id="t3h">t3h</span>
    <span id="z0r">z0r</span>
  </a>
);

const BlogPage = ({md, meta}) => {
  const postHtml = renderMd(md);
  const postTitle = findHeader(md);
  const pageProps = (meta && meta.pageProps) || {};
  const type = (meta && meta.type) || "post";

  const doc = {
    ...pageProps,
    scripts: [
      "/blog-scripts.js",
      ...pageProps.scripts
    ],
    styles: [
      "/blog-styles.css",
      "/atom-one-light.css",
      "/katex/dist/katex.min.css",
      ...pageProps.styles
    ],
    title: `${pageProps.title || postTitle || "Blog"} - t3hz0r`,
  };

  return (
    <StandardPage doc={doc} headerTitle={headerTitle} navContent={navContent}>
      <article
        className={`blog-page type-${type}`}
        dangerouslySetInnerHTML={{__html: postHtml}}
      />
    </StandardPage>
  );
};

export default BlogPage;