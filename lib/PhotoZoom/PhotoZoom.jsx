import React from "react";
import ReactDOM from "react-dom";

class PhotoZoomIso extends React.Component {
  constructor() {
    super();
    this.toggle = this.toggle.bind(this);
    this.state = {zoomed: false, zoomable: false};
  }

  toggle() {
    this.setState({zoomed: !this.state.zoomed});
  }

  componentDidMount() {
    this.setState({zoomable: true});
  }

  render() {
    const zoomed = this.state.zoomed;
    return (
      <a
        className={`photo-zoom${zoomed ? " zoomed" : ""}`}
        href={this.state.zoomable ? "#" : this.props.srcFull}
        onClick={this.toggle}
      >
        <img src={zoomed ? this.props.srcFull : this.props.srcThumb}/>
      </a>
    );
  }
}

//todo: genericize by converting props to data-attributes
const PhotoZoom = (props) => {
  const dataAttribs = {
    "data-src-full": props.srcFull,
    "data-src-thumb": props.srcThumb
  };
  return (
    <div className="photo-zoom-hydrate" {...dataAttribs}>
      <PhotoZoomIso {...props}/>
    </div>
  );
};

const hydrate = function(document) {
  Array.prototype.forEach.call(document.querySelectorAll(".photo-zoom-hydrate"), el => {
    const props = {
      srcFull: el.dataset.srcFull,
      srcThumb: el.dataset.srcThumb
    };
    ReactDOM.hydrate(<PhotoZoomIso {...props}/>, el);
  });
};

export default PhotoZoom;
export {hydrate};
