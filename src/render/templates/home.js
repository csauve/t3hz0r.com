const {html} = require("common-tags");
const {wrapper, icon} = require("./common");

module.exports = (page) => wrapper(html`
  <canvas class="landing-background render-fs" data-fs-src="/assets/background.glsl"></canvas>
  <div class="landing">
    <div class="landing-content">
      <div class="col1">
        <h1 class="big-title">Hypertext, delivered fresh*</h1>
        <p><small>* FRESH NOT GUARANTEED （　´_ゝ\`)</small></p>
      </div>
      <div class="col2">
        <p>Welcome to the web home of <a href="/about">Connor Sauve</a>. I'm a software developer with interests in game modding, digital art, and photography.</p>
      </div>
    </div>
  </div>
  <main class="main-content">
  ${page.bodyHtml}
  </main>
`);
