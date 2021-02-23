precision mediump float;
uniform vec2 canvasSize;
uniform float timeSec;

float sphere(vec2 pt, vec2 offset, float size) {
  pt = abs(pt - offset) / size;
  return sqrt(pow(pt.x, 2.0) + pow(pt.y, 2.0));
}

float op_smooth_union(float d1, float d2, float k) {
  float h = clamp(0.5 + 0.5 * (d2 - d1) / k, 0.0, 1.0);
  return mix(d2, d1, h) - k * h * (1.0 - h);
}

vec2 op_repeat(vec2 pt, float c) {
  return mod(pt + 0.5 * c, c) - 0.5 * c;
}

float scene(vec2 pt, float t) {
  vec2 screenSpace = pt / canvasSize + 0.5 * 0.5;

  float balls = 10000.0;

  for (int i = 0; i < 20; i++) {
    vec2 offset = vec2(
      (sin(t + 10.0 * float(i)) * 0.5 + 0.5) * canvasSize.x,
      (sin(t + 2.0 * float(i)) * 2.5 + 1.0) * 50.0 + canvasSize.y / 2.0
    );
    balls = op_smooth_union(balls, sphere(pt, offset, 100.0 * screenSpace.y), 0.5);
  }

  return op_smooth_union(
    sphere(op_repeat(pt + vec2(screenSpace.y * 200.0, sin(screenSpace.x * 20.0) * 200.0), 50.0), vec2(0.0), screenSpace.y * 20.0),
    balls,
    1.5
  );
}

void main() {
  float dist = scene(gl_FragCoord.xy, timeSec * 0.04);
  vec2 screenSpace = gl_FragCoord.xy / canvasSize + 0.5 * 0.5;
  float fadeIn = min(0.1 * screenSpace.y, timeSec / 4.0);
  if (dist < 0.5) {
    gl_FragColor = vec4(vec3(10.0 / 255.0, 129.0 / 255.0, 146.0 / 255.0) * fadeIn, fadeIn);
  } else {
    gl_FragColor = vec4(0.0);
  }
}
