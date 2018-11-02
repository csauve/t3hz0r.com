import React from "react";
import BlogPage from "./BlogPage.jsx";

const landing = (
  <div className="landing">
    <div className="landing-content">
      <h1>Hypertext, delivered fresh*</h1>
      <div>
        <p>Hi, I'm <a href="/about">Connor Sauve</a>, and welcome to my blog! This is where I share my projects and interests in software, photography, art, and gaming. Available by <a rel="alternate" type="application/rss+xml" href="/rss.xml">RSS</a>.</p>
        <p><small>* FRESH NOT GUARANTEED （　´_ゝ`)</small></p>
      </div>
    </div>
    <div className="landing-background render-fs" data-fs-src="background.glsl"></div>
  </div>
);

const HomePage = ({posts}) => (
  <BlogPage title={"Blog"} meta={{}} mainHeader={landing}>
    <article className="blog-article">
      <section>
        <nav>
          <h2>Posts index</h2>
          <ul>
            {posts.map(({title, bodyHtml, meta, path}) =>
              <li key={path}>
                <a href={path}>{title}</a>
                <br/>
                <small><time dateTime={meta.dateIso}>{meta.dateIso}</time></small>
              </li>
            )}
          </ul>
        </nav>
      </section>
    </article>
  </BlogPage>
);

export default HomePage;
