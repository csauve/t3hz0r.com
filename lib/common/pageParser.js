import fm from "front-matter";
import {renderMd, findHeader} from "./markdown.js";

const parseBlogPage = function(fileContents, relativePath) {
  const {attributes: meta, body: md} = fm(fileContents);
  const indexIndex = relativePath.indexOf("index.html");

  return {
    bodyTitle: findHeader(md),
    bodyHtml: renderMd(md),
    meta: {
      ...meta,
      dateIso: meta.date ? meta.date.toISOString().substring(0, 10) : null
    },
    path: indexIndex == -1 ? relativePath : relativePath.substring(0, indexIndex)
  };
};

export {parseBlogPage};