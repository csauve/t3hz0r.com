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
    <hr>
    <nav>
      <h2>${icon("tool")} Projects</h2>
      <ul class="projects-list">
        <li style="background-image:url(screenshot4.png)">
          <a href="/projects/cold-shoulder">
            <h3>Cold Shoulder</h3>
            <p>A Halo CE map set at a chilly Russian power plant.</p>
          </a>
        </li>
        <li style="background-image:url(screenshot.jpg)">
          <a href="/projects/alpine">
            <h3>Alpine</h3>
            <p>An atmospheric Halo CE map with asymmetric bases.</p>
          </a>
        </li>
        <li class="flex-2" style="background-image:url(343.jpg)">
          <a href="/projects/alpine">
            <h3>c20</h3>
            <p>A project to archive and document the Halo modding community's knowledge.</p>
          </a>
        </li>
        <li class="flex-3" style="background-image:url(art.png)">
          <a href="/projects/alpine">
            <h3>Enemy Territory</h3>
          </a>
        </li>
      </ul>

      <h2>${icon("pen-tool")} Posts</h2>
      <ul>
        <li>
          <a href="/post/halo-ce-on-linux/">How to run Halo Custom Edition on Linux with community mods</a>
          <br>
          <small>${icon("calendar")} <time datetime="2019-05-13">2019-05-13</time></small>
        </li>
        <li>
          <a href="/post/organizing-by-context-heirarchies/">Organizing files by context hierarchies</a>
          <br>
          <small>${icon("calendar")} <time datetime="2018-06-14">2018-06-14</time></small>
        </li>
      </ul>
      <p><a href="/post">See more posts</a></p>
    </nav>
  </main>
`);
