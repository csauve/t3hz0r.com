const fm = require("front-matter");
const {renderMd, findHeader} = require("./markdown.js");
const templates = require("./templates");
const {html} = require("common-tags");

function parsePage(fileContents, relativePath) {
  const {attributes: meta, body: md} = fm(fileContents);
  const indexIndex = relativePath.indexOf("index.html");

  return {
    ...meta,
    dateIso: meta.date ? meta.date.toISOString().substring(0, 10) : null,
    title: meta.title || "Blog",
    template: meta.template || "post",
    path: indexIndex == -1 ? relativePath : relativePath.substring(0, indexIndex),
    bodyHtml: renderMd(md),
  };
}

function renderPage(page) {
  const template = templates[page.template];
  return html`
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charSet="UTF-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <meta httpEquiv="X-UA-Compatible" content="ie=edge"/>
        <link rel="stylesheet" href="/assets/blog.css"/>
        <link rel="stylesheet" href="/atom-one-light.css"/>
        <link rel="icon" type="image/png" href="/assets/favicon.png"/>
        <link rel="alternate" type="application/rss+xml" href="/rss.xml"/>
        <title>${page.title}</title>
      </head>
      <body>
    ${template(page)}
        <script type="application/javascript" src="/three.min.js"></script>
        <script type="application/javascript" src="/assets/blog.js"></script>
        ${page.scripts && page.scripts.map(src => html`
          <script type="application/javascript" src="${src}"></script>
        `)}
      </body>
    </html>
  `;
}

module.exports = {parsePage, renderPage};
