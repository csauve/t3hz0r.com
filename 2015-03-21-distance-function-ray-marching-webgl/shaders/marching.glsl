precision mediump float;
const float EPSILON = 0.001;
const float MAX_DISTANCE = 75.0;
const int MAX_STEPS = 256;
uniform vec2 canvasSize;
uniform float timeSec;

vec3 repeat(vec3 point, vec3 c) {
  return mod(point, c) - 0.5 * c;
}

float sceneDistance(vec3 point, float radius) {
  return max(0.0, length(repeat(point, vec3(6.0))) - radius);
}

float march(vec3 rayOrigin, vec3 rayDirection) {
  float rayLength = 0.0;
  for (int i = 0; i < MAX_STEPS; i++) {
    vec3 leadingPoint = rayOrigin + rayLength * rayDirection;
    float distanceToScene = sceneDistance(leadingPoint, 2.0);
    rayLength += distanceToScene;
    if (distanceToScene < EPSILON) return rayLength;
    if (rayLength > MAX_DISTANCE) break;
  }
  return -1.0;
}

vec3 circlePath(float y, float radius, float time) {
  return vec3(sin(time) * radius, y, cos(time) * radius);
}

void main() {
  //camera setup
  vec3 cameraPos = circlePath(0.5, 5.0, timeSec / 2.0);
  vec3 cameraLookAtPos = vec3(0.0);
  vec3 cameraUpDir = vec3(0.0, 1.0, 0.0);
  vec3 cameraLookDir = normalize(cameraLookAtPos - cameraPos);

  //screen setup
  vec2 screenCoord = gl_FragCoord.xy / canvasSize.xy - 0.5;
  vec3 screenXDir = normalize(cross(cameraUpDir, cameraLookDir));
  vec3 screenYDir = cross(cameraLookDir, screenXDir);
  vec3 screenOrigin = cameraPos + cameraLookDir;

  //ray setup
  vec3 rayOrigin = screenOrigin +
      screenCoord.x * screenXDir * canvasSize.x / canvasSize.y +
      screenCoord.y * screenYDir;
  vec3 rayDir = normalize(rayOrigin - cameraPos);

  float rayLength = march(rayOrigin, rayDir);

  gl_FragColor = rayLength == -1.0 ?
      vec4(0.0) : //miss (transparent)
      vec4(vec3(1.0 - rayLength / 50.0), 1.0); //hit
}