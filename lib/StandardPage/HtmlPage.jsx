import React from "react";

const HtmlPage = ({title, children, styles, scripts, favicon}) => (
  <html lang="en">
    <head>
      <meta charSet="UTF-8"/>
      <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
      <meta httpEquiv="X-UA-Compatible" content="ie=edge"/>
      {styles && styles.map(src =>
        <link key={src} rel="stylesheet" href={src}/>
      )}
      {favicon && <link rel="icon" type="image/png" href={favicon}/>}
      {title && <title>{title}</title>}
    </head>
    <body>
      {children}
      {scripts && scripts.map(src =>
        <script key={src} type="application/javascript" src={src}/>
      )}
    </body>
  </html>
);

export default HtmlPage;