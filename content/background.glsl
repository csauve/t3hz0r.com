precision mediump float;
uniform vec2 canvasSize;
uniform float timeSec;

bool scene(vec2 pt, float t) {
  vec2 screenSpace = pt / canvasSize;
  float paddingShadow = min(1.0, abs(screenSpace.x - 0.5));
  vec2 sceneSpace = vec2(0.01 * pt.x + pt.y * 0.01, (mod(pt.y, 50.0) - 25.0) / 20.0);
  float padding = abs(sin(t * 1.2 - sceneSpace.x)) * 0.5 * paddingShadow;
  return
    sceneSpace.y < (sin(t + sceneSpace.x) + padding) &&
    sceneSpace.y > (sin(t + sceneSpace.x) - padding);
}

void main() {
  bool hit = scene(gl_FragCoord.xy, timeSec);
  if (hit) {
    gl_FragColor = vec4(1.0, 0.0, 1.0, 0.08);
  } else {
    gl_FragColor = vec4(0.0);
  }
}