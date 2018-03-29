import React from "react";
import HtmlPage from "./HtmlPage.jsx";

const StandardPage = ({title, children, styles, scripts}) => {
  const pageProps = {
    styles: ["/blog-styles.css", "/atom-one-light.css", ...styles],
    scripts: ["/blog-scripts.js", ...scripts],
    title: title || "t3hz0r",
    favicon: "/favicon.png"
  };

  return (
    <HtmlPage {...pageProps}>
      <header className="site-header">
        <a id="home-link" href="/">
          <span id="t3h">t3h</span>
          <span id="z0r">z0r</span>
        </a>
        <nav>
          <a href="/">index</a>
          <a href="https://github.com/csauve?tab=repositories">github</a>
          <a href="/photos">photos</a>
          <a href="/about">about</a>
        </nav>
      </header>
      <main>
        {children}
      </main>
    </HtmlPage>
  );
};

export default StandardPage;