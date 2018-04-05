import React from "react";
import ReactDOM from "react-dom";
import Dimensions from "react-dimensions";
import {initProgram, makeShader, renderLoop, plane, vertexShader} from "./gl.js";

class FragmentShader extends React.PureComponent {
  constructor() {
    super();
    this.init = this.init.bind(this);
    this.state = {
      startTime: new Date().getTime()
    };
  }

  componentDidMount() {
    this.init();
  }

  componentDidUpdate() {
    this.init();
  };

  init() {
    console.log("Initializing fragment shader");
    const fsContent = this.props.fsSrc;
    const canvas = this.canvas;

    try {
      var gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
      gl.clearColor(0.0, 0.0, 0.0, 1.0);
      gl.enable(gl.DEPTH_TEST);
      gl.depthFunc(gl.LEQUAL);

      var program = initProgram(gl, vertexShader, fsContent);
      var vbo = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(plane), gl.STATIC_DRAW);
      program.positionAttrib = gl.getAttribLocation(program, "position");
      gl.enableVertexAttribArray(program.positionAttrib);
      gl.vertexAttribPointer(program.positionAttrib, 3, gl.FLOAT, false, 0, 0);

      gl.uniform2f(gl.getUniformLocation(program, "canvasSize"), this.props.containerWidth, this.props.containerHeight);

      renderLoop(this.state.startTime, gl, canvas, program);
    } catch (err) {
      this.setState({err});
    }
  }

  render() {
    return (
      <div className="fragment-shader">
        {this.state.err ? (
          <p>{err.message}<br/>{err.stack}</p>
        ) : (
          <canvas
            ref={ref => this.canvas = ref}
            width={this.props.containerWidth}
            height={this.props.containerHeight}
          />
        )}
      </div>
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