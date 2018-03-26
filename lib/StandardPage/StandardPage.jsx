import React from "react";
import HtmlPage from "./HtmlPage.jsx";

const StandardPage = ({title, children, styles, scripts, navHeader, navItems}) => {
  const pageProps = {
    styles: ["/blog-styles.css", "/atom-one-light.css", ...styles],
    scripts,
    title: title || "t3hz0r"
  };

  return (
    <HtmlPage {...pageProps}>
      <header className="site-header">
        {navHeader || <a href="/">t3hz0r</a>}
        {navItems &&
          <nav>{navItems}</nav>
        }
      </header>
      <main>
        {children}
      </main>
    </HtmlPage>
  );
};

export default StandardPage;