import React from "react";
import {StandardPage} from "t3h-ui/lib/common";

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

const BlogPage = ({title, children, meta, path}) => {
  const doc = {
    ...meta,
    scripts: [
      "/t3h-assets/common/common-bundle.js",
      "/t3h-assets/graphics/graphics-bundle.js",
      "/blog-bundle.js",
      ...meta.scripts
    ],
    styles: [
      "/blog-bundle.css",
      "/atom-one-light.css",
      "/katex/dist/katex.min.css",
      ...meta.styles
    ],
    feedUrl: "/rss.xml",
    title: `${title} - t3hz0r`,
  };

  return (
    <StandardPage doc={doc} headerTitle={headerTitle} navContent={navContent}>
      {children}
    </StandardPage>
  );
};

export default BlogPage;
