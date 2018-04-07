import React from "react";
import StandardPage from "../StandardPage/StandardPage.jsx";
import {renderMd, findHeader} from "../common/markdown.js";

const nav = (
  <nav>
    <a href="/">index</a>
    <a href="https://github.com/csauve?tab=repositories">code</a>
    <a href="https://www.flickr.com/photos/csauve/">photos</a>
    <a href="/links">links</a>
    <a href="/about">about</a>
  </nav>
);

const BlogPage = ({md, meta}) => {
  const postHtml = renderMd(md);
  const postTitle = findHeader(md);
  const pageProps = (meta && meta.pageProps) || {};
  const type = (meta && meta.type) || "post";

  const blogProps = {
    ...pageProps,
    scripts: ["/blog-scripts.js", ...pageProps.scripts],
    styles: ["/blog-styles.css", "/atom-one-light.css", ...pageProps.styles],
    title: `${pageProps.title || postTitle || "Blog"} - t3hz0r`,
  };

  return (
    <StandardPage {...blogProps} nav={nav}>
      <article
        className={`blog-page type-${type}`}
        dangerouslySetInnerHTML={{__html: postHtml}}
      />
    </StandardPage>
  );
};

export default BlogPage;