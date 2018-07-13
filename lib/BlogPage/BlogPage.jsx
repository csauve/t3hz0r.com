import React from "react";
import {StandardPage} from "t3h-ui/lib/components.js";
import {navContent, headerTitle} from "../common/commonElements.jsx";

const BlogPage = ({bodyTitle, bodyHtml, meta, path}) => {
  const doc = {
    ...meta,
    scripts: [
      "/blog-scripts.js",
      ...meta.scripts
    ],
    styles: [
      "/blog-styles.css",
      "/atom-one-light.css",
      "/katex/dist/katex.min.css",
      ...meta.styles
    ],
    title: `${meta.title || bodyTitle || "Blog"} - t3hz0r`,
  };

  return (
    <StandardPage doc={doc} headerTitle={headerTitle} navContent={navContent}>
      <article className="blog-article">
        {meta.dateIso &&
          <header className="article-header">
            <p>Posted <time dateTime={meta.dateIso}>{meta.dateIso}</time></p>
          </header>
        }
        <section dangerouslySetInnerHTML={{__html: bodyHtml}}/>
      </article>
    </StandardPage>
  );
};

export default BlogPage;