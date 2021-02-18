const {html} = require("common-tags");
const {wrapper} = require("./common");

module.exports = (page) => wrapper(html`
  <main class="main-content">
  ${page.bodyHtml}
  </main>
`);
