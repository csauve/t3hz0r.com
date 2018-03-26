import React from "react";
import marked from "marked";
import StandardPage from "../StandardPage/StandardPage.jsx";
import hljs from "highlight.js";

const navItems = [
  <a key="index" href="/">index</a>,
  <a key="about" href="/about">about</a>,
  <a key="github" href="https://github.com/csauve?tab=repositories">github</a>,
  <a key="photos" href="https://www.flickr.com/photos/csauve/">photos</a>,
];
const navHeader = (
  <a id="home-link" href="/">
    <span id="t3h">t3h</span>
    <span id="z0r">z0r</span>
  </a>
);

const renderMd = function(md) {
  return marked(md, {
    renderer: new marked.Renderer(),
    gfm: true,
    tables: true,
    breaks: true,
    pedantic: false,
    sanitize: false,
    smartlists: true,
    smartypants: false,
    highlight: (code, lang, cb) => lang ? hljs.highlight(lang, code).value : code
  });
};

const BlogPage = ({md}) => {
  const postHtml = renderMd(md);

  const pageProps = {
    title: "blog - t3hz0r", //TODO: header parsing
    navHeader,
    navItems
  };

  return (
    <StandardPage {...pageProps}>
      <article className="blog-page" dangerouslySetInnerHTML={{__html: postHtml}}/>
    </StandardPage>
  );
};

export default BlogPage;