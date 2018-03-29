import React from "react";
import StandardPage from "../StandardPage/StandardPage.jsx";
import PhotoZoom from "../PhotoZoom/PhotoZoom.jsx";
import renderMd from "../common/markdown.js";

const GalleryPage = ({md, images}) => {
  const introHtml = renderMd(md);

  const pageProps = {
    title: "Photos - t3hz0r"
  };

  return (
    <StandardPage {...pageProps}>
      <article className="gallery-page">
        <section className="introduction" dangerouslySetInnerHTML={{__html: introHtml}}/>
        <section className="photo-gallery">
          {images && images.map(({srcThumb, srcFull, aspect}) =>
            <div key={srcFull} className={`photo ${aspect}`}>
              <div className="photo-container">
                <PhotoZoom srcThumb={srcThumb} srcFull={srcFull}/>
              </div>
            </div>
          )}
        </section>
      </article>
    </StandardPage>
  );
};

export default GalleryPage;