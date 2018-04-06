import React from "react";
import ReactDOM from "react-dom";
import Dimensions from "react-dimensions";
import * as THREE from "three";

const vertexShader = `
  attribute vec3 position;
  varying vec2 uv;

  void main() {
    gl_Position = vec4(position, 1.0);
    uv = position.xy;
  }
`;

class FragmentShader extends React.PureComponent {
  constructor() {
    super();
    this.startTime = new Date().getTime();
  }

  init() {
    console.log("Initializing fragment shader");
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 1, 1000);
    const geometry = new THREE.PlaneGeometry(2, 2, 1, 1);
    const material = new THREE.RawShaderMaterial({
      uniforms: {
        timeSec: {value: (new Date().getTime() - this.startTime) / 1000},
        canvasSize: {value: new THREE.Vector2(this.props.containerWidth, this.props.containerHeight)}
      },
      vertexShader,
      fragmentShader: this.props.fsSrc
    });
    const plane = new THREE.Mesh(geometry, material);
    scene.add(plane);

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      stencil: false,
      depth: false,
      alpha: true,
    });

    this.resize();

    const animate = () => {
      material.uniforms.timeSec.value = (new Date().getTime() - this.startTime) / 1000;
      material.uniforms.canvasSize.value = new THREE.Vector2(this.props.containerWidth, this.props.containerHeight);
      this.renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };
    animate();
  }

  componentDidMount() {
    this.init();
  }

  resize() {
    //changes the canvas size and GL context viewport
    this.renderer.setSize(this.props.containerWidth, this.props.containerHeight);
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.fsSrc != this.props.fsSrc) {
      this.init();
    } else {
      this.resize();
    }
  };

  render() {
    return (
      <canvas ref={ref => this.canvas = ref}/>
    );
  }
}

FragmentShader = Dimensions()(FragmentShader);

const clientInit = function(document) {
  Array.prototype.forEach.call(document.getElementsByClassName("render-fs"), el => {
    fetch(el.dataset.fsSrc).then(response => {
      response.text().then(fsSrc =>
        ReactDOM.render(<FragmentShader fsSrc={fsSrc}/>, el)
      );
    });
  });
};

export {clientInit};