const emoji = require("markdown-it-emoji");
const markdownIt = require("markdown-it");
const linkify = require("linkify-it");
const hljs = require("highlight.js");

const renderer = markdownIt({
  html: true,
  linkify: true,
  typographer: false,
  breaks: false,
  highlight: (code, lang) => {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return hljs.highlight(lang, code).value;
      } catch (err) {
        console.warn(`Failed to highlight code with language ${lang}`);
      }
    }
    return code;
  }
});

// renderer.use(emoji);
// renderer.use(katex);

//prevents protocol-less links from being turned into <a>
renderer.linkify.set({
  fuzzyLink: false
});

function renderMd(md) {
  return renderer.render(md);
}

module.exports = {
  renderMd
};
