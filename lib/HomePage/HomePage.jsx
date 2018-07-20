import React from "react";
import {StandardPage} from "t3h-ui/lib/components.js";
import {navContent, headerTitle} from "../common/commonElements.jsx";

const HomePage = ({posts}) => {
  const doc = {
    scripts: [
      "/blog-scripts.js"
    ],
    styles: [
      "/blog-styles.css",
      "/atom-one-light.css",
      "/katex/dist/katex.min.css"
    ],
    feedUrl: "/rss.xml",
    title: "Blog - t3hz0r"
  };

  return (
    <StandardPage doc={doc} headerTitle={headerTitle} navContent={navContent}>
      <article className="blog-article">
        <header>
          <h1>Hypertext, delivered fresh*</h1>
          <p>Hi, I'm <a href="/about">Connor Sauve</a>, and welcome to my blog! This is where I share my projects and interests in software, photography, art, and gaming. Available by <a rel="alternate" type="application/rss+xml" href="/rss.xml">RSS</a>.</p>
          <p><small>* FRESH NOT GUARANTEED （　´_ゝ`)</small></p>
        </header>
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
      <div className="landing-background render-fs" data-fs-src="background.glsl"></div>
    </StandardPage>
  );
};

export default HomePage;