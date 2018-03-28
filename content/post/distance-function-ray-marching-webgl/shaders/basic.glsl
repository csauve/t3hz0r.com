precision mediump float;
uniform vec2 canvasSize;
uniform float timeSec;

void main() {
  gl_FragColor = vec4(
    smoothstep(-1.0, 1.0, gl_FragCoord.xy / canvasSize.xy),
    smoothstep(-1.0, 1.0, sin(timeSec)),
    1.0
  );
}