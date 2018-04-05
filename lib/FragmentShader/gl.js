const vertexShader = `
  attribute vec3 position;
  varying vec2 uv;

  void main() {
    gl_Position = vec4(position, 1.0);
    uv = position.xy;
  }
`;

const plane = [
  -1.0, -1.0, 0.0,
  -1.0,  1.0, 0.0,
   1.0, -1.0, 0.0,
   1.0,  1.0, 0.0
];

var renderLoop = function(startTime, gl, canvas, program) {
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

export {initProgram, makeShader, renderLoop, plane, vertexShader};