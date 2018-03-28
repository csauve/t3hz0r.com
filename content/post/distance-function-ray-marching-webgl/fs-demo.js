import React from "react";
import ReactDOM from "react-dom";

const vertexShader = `
  attribute vec3 position;
  varying vec2 uv;

  void main() {
    gl_Position = vec4(position, 1.0);
    uv = position.xy;
  }
`;

class FsDemo extends React.Component {
  constructor() {
    super();
  }

  componentDidMount() {
    const fsContent = this.props.fsSrc;

    var renderLoop = function(gl, canvas, program) {
      var startTime = new Date().getTime();

      function renderFrame() {
        var timeNow = new Date().getTime();
        gl.uniform1f(gl.getUniformLocation(program, "timeSec"), (timeNow - startTime) / 1000);
        gl.viewport(0, 0, canvas.width, canvas.height);
        gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

        window.requestAnimationFrame(renderFrame);
      }

      window.requestAnimationFrame(renderFrame);
    };

    var makeShader = function(gl, source, type) {
      var shader = gl.createShader(type);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        throw new Error(gl.getShaderInfoLog(shader));
      }
      return shader;
    };

    var initProgram = function(gl, vsSource, fsSource) {
      var vShader = makeShader(gl, vsSource, gl.VERTEX_SHADER);
      var fShader = makeShader(gl, fsSource, gl.FRAGMENT_SHADER);
      var shaderProgram = gl.createProgram();
      gl.attachShader(shaderProgram, vShader);
      gl.attachShader(shaderProgram, fShader);
      gl.linkProgram(shaderProgram);
      if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        throw new Error(gl.getProgramInfoLog(shaderProgram));
      }
      gl.useProgram(shaderProgram);
      return shaderProgram;
    };

    try {
      var canvas = this.canvas;
      var gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
      gl.clearColor(0.0, 0.0, 0.0, 1.0);
      gl.enable(gl.DEPTH_TEST);
      gl.depthFunc(gl.LEQUAL);

      var program = initProgram(gl, vertexShader, fsContent);

      var plane = [
        -1.0, -1.0, 0.0,
        -1.0,  1.0, 0.0,
         1.0, -1.0, 0.0,
         1.0,  1.0, 0.0
      ];
      var vbo = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(plane), gl.STATIC_DRAW);
      program.positionAttrib = gl.getAttribLocation(program, "position");
      gl.enableVertexAttribArray(program.positionAttrib);
      gl.vertexAttribPointer(program.positionAttrib, 3, gl.FLOAT, false, 0, 0);

      gl.uniform2f(gl.getUniformLocation(program, "canvasSize"), 640, 480);

      renderLoop(gl, canvas, program);
    } catch (e) {
      console.error(e.stack);
    }
  }

  render() {
    return (
      <canvas ref={ref => this.canvas = ref} width="640" height="480"></canvas>
    );
  }
}

Array.prototype.forEach.call(document.getElementsByClassName("fs-demo"), el => {
  fetch(el.dataset.fsSrc).then(response => {
    response.text().then(fsSrc =>
      ReactDOM.render(<FsDemo fsSrc={fsSrc}/>, el)
    );
  });
});