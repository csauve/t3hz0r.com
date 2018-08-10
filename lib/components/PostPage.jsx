import React from "react";
import BlogPage from "./BlogPage.jsx";

const PostPage = ({title, bodyHtml, meta}) => (
  <BlogPage title={title} meta={meta}>
    <article className="blog-article">
      {meta.dateIso &&
        <header className="article-header">
          <p>Posted <time dateTime={meta.dateIso}>{meta.dateIso}</time></p>
        </header>
      }
      <section dangerouslySetInnerHTML={{__html: bodyHtml}}/>
    </article>
  </BlogPage>
);

export default PostPage;
