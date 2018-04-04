import React from "react";
import HtmlPage from "./HtmlPage.jsx";

const StandardPage = ({title, children, styles, scripts, favicon, nav}) => {
  const pageProps = {
    styles: ["/normalize.css", ...styles],
    scripts: scripts,
    title: title || "t3hz0r",
    favicon: favicon || "/favicon.png"
  };

  return (
    <HtmlPage {...pageProps}>
      <header className="site-header">
        <a id="home-link" href="/">
          <span id="t3h">t3h</span>
          <span id="z0r">z0r</span>
        </a>
        {nav}
      </header>
      <main>
        {children}
      </main>
    </HtmlPage>
  );
};

export default StandardPage;