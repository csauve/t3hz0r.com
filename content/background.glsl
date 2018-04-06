precision mediump float;
uniform vec2 canvasSize;
uniform float timeSec;

bool scene(vec2 pt, float t) {
  pt = vec2(0.01 * pt.x + pt.y * 0.01, (mod(pt.y, 50.0) - 25.0) / (20.0));
  float padding = abs(sin(t - pt.x)) * 0.1;
  return pt.y < (sin(t + pt.x) + padding) && pt.y > (sin(t + pt.x) - padding);
}

void main() {
  vec2 pt = gl_FragCoord.xy;
  bool hit = scene(pt, timeSec);
  if (hit) {
    gl_FragColor = vec4(1.0, 0.0, 1.0, 0.08);
  } else {
    gl_FragColor = vec4(0.0);
  }
}