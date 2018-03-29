import React from "react";
import StandardPage from "../StandardPage/StandardPage.jsx";
import renderMd from "../common/markdown.js";

const PostPage = ({md}) => {
  const postHtml = renderMd(md);

  const pageProps = {
    title: "Blog - t3hz0r", //TODO: header parsing
  };

  return (
    <StandardPage {...pageProps}>
      <article
        className="post-page"
        dangerouslySetInnerHTML={{__html: postHtml}}
      />
    </StandardPage>
  );
};

export default PostPage;