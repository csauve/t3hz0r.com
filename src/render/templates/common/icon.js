const {html} = require("common-tags");

module.exports = (name, title) => html`
  <svg class="feather" ${title ? `aria-labelledby="title"` : ""}>
    ${title && html`
      <title>${title}</title>
    `}
    <use xlink:href="/feather-sprite.svg#${name}"/>
  </svg>
`;
