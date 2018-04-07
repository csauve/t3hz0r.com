import markdownIt from "markdown-it";
import emoji from "markdown-it-emoji";
import helpers from "commonmark-helpers";
import hljs from "highlight.js";

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
}).use(emoji);

const renderMd = function(md) {
  return renderer.render(md);
};

const findHeader = function(md) {
  const node = helpers.match(md, helpers.isHeader);
  return node ? helpers.text(node) : null;
};

export {renderMd, findHeader};