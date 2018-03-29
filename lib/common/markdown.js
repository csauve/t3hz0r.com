import marked from "marked";
import hljs from "highlight.js";

const renderMd = function(md) {
  return marked(md, {
    renderer: new marked.Renderer(),
    gfm: true,
    tables: true,
    breaks: false,
    pedantic: false,
    sanitize: false,
    smartlists: true,
    smartypants: false,
    highlight: (code, lang, cb) => lang ? hljs.highlight(lang, code).value : code
  });
};

export default renderMd;