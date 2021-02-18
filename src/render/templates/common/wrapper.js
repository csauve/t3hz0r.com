const {html} = require("common-tags");
const icon = require("./icon");

module.exports = (children) => html`
  <nav class="site-navigation" role="navigation">
    <div class="nav-elements">
      <div id="nav-title">
        <a id="home-link" href="/">
          <span id="t3h">t3h</span>
          <span id="z0r">z0r</span>
        </a>
      </div>
      <div id="nav-links">
        <ul>
          <li><a href="/">home</a></li>
          <li><a href="/post">posts</a></li>
          <li><a href="https://github.com/csauve?tab=repositories">code</a></li>
          <li><a href="https://www.flickr.com/photos/csauve/">photos</a></li>
          <li><a href="/about">about</a></li>
          <li><a rel="alternate" type="application/rss+xml" href="/rss.xml">${icon("rss", "RSS feed")}</a></li>
        </ul>
      </div>
    </div>
  </nav>
  ${children}
`;
