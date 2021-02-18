const {html} = require("common-tags");
const {wrapper, icon} = require("./common");

const formatDate = (dateIso) => new Date(dateIso).toLocaleString("en", {dateStyle: "long"});

// <BlogPage title={post.title} meta={meta}>
// </BlogPage>
module.exports = (page) => {
  return wrapper(html`
    <main class="main-content">
      <article class="blog-article">
        <h1>${page.title}</h1>
        ${page.dateIso && html`
          <header class="article-header">
            <p>${icon("calendar", "Date posted")} <time dateTime="${page.dateIso}">${formatDate(page.dateIso)}</time></p>
          </header>
        `}
        <hr>
    ${page.bodyHtml}
      </article>
    </main>
  `);
};
