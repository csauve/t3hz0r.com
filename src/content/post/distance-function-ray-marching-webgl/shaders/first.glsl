precision mediump float;

void main() {
  gl_FragColor = vec4(
    smoothstep(-1.0, 1.0, sin(gl_FragCoord.x / 5.0)),
    smoothstep(-1.0, 1.0, sin(gl_FragCoord.y / 10.0)),
    1.0, 1.0
  );
}