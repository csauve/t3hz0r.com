const drawingCanvas = document.getElementById("drawing-canvas");
const angleCanvas = document.getElementById("angle-canvas");
const lengthCanvas = document.getElementById("length-canvas");
const drawingCtx = drawingCanvas.getContext("2d");
const angleCtx = angleCanvas.getContext("2d");
const lengthCtx = lengthCanvas.getContext("2d");
let curvePoints = [];
let drawing = false;

const lineLength = function(a, b) {
  return Math.hypot(b.x - a.x, b.y - a.y); //euclidean distance
};

const lineAngle = function(a, b) {
  const x = a.x - b.x;
  const y = a.y - b.y;
  return 2 * (y < 0 ? Math.atan(-y / -x) : Math.atan(y / x));
};

const radiansToDegrees = function(rads) {
  return rads / (Math.PI / 180);
};

const getAtCircular = function(curve, i) {
  return curve[i % curve.length];
};

const indexCurve = function(curvePoints) {
  let len = 0;
  let minX = Infinity, minY = Infinity, maxX = 0, maxY = 0;
  const index = Array(curvePoints.length);
  for (let i = 0; i < curvePoints.length; i++) {
    index[i] = len;
    let a = curvePoints[i];
    let b = getAtCircular(curvePoints, i + 1);
    len += lineLength(a, b);
    //find minimum bounding box
    if (a.x < minX) minX = a.x;
    if (a.y < minY) minY = a.y;
    if (a.x > maxX) maxX = a.x;
    if (a.y > maxY) maxY = a.y;
  }
  return {
    tIndex: index.map(d => d / len),
    maxBoundingLen: lineLength({x: minX, y: minY}, {x: maxX, y: maxY})
  };
};

const getSegmentParameter = function(t, t0, t1) {
  return (t - t0) / (t1 - t0);
};

const lerpPoints = function(t, p0, p1) {
  return {
    x: (1 - t) * p0.x + t * p1.x,
    y: (1 - t) * p0.y + t * p1.y
  };
};

const getParametricPoint = function(curvePoints, tIndex, t) {
  let l = 0, r = tIndex.length;
  while (r - l > 1) {
    let m = Math.floor((r + l) / 2);
    let tM = tIndex[m];
    if (tM < t) l = m;
    else if (tM > t) r = m;
    else {l = m; break}
  }
  const t0 = tIndex[l]; //0.95
  const t1 = getAtCircular(tIndex, l + 1) || 1;
  return lerpPoints(
    getSegmentParameter(t, t0, t1),
    curvePoints[l],
    getAtCircular(curvePoints, l + 1)
  );
};

const render = function(curvePoints) {
  const {tIndex, maxBoundingLen} = indexCurve(curvePoints);
  //todo: parallelize on GPU
  for (let y = 0; y < angleCanvas.height; y++) {
    const pointB = getParametricPoint(curvePoints, tIndex, y / angleCanvas.height);
    //start from y because symmetric
    for (let x = 0; x < angleCanvas.width; x++) {
      const pointA = getParametricPoint(curvePoints, tIndex, x / angleCanvas.width);
      const distance = lineLength(pointA, pointB) / maxBoundingLen;
      const angle = lineAngle(pointA, pointB);
      angleCtx.fillStyle = `hsl(${Math.floor(radiansToDegrees(angle))}, ${100}%, ${50}%)`;
      angleCtx.fillRect(x, y, 1, 1);
      lengthCtx.fillStyle = `hsl(${0}, ${0}%, ${Math.floor(distance * 100)}%)`;
      lengthCtx.fillRect(x, y, 1, 1);
    }
  }
};

const getPoint = function(e) {
  const rect = drawingCanvas.getBoundingClientRect();
  return {
    x: Math.floor(e.clientX - rect.left),
    y: Math.floor(e.clientY - rect.top),
  };
};

const drawLine = function(ctx, a, b) {
  ctx.beginPath();
  ctx.moveTo(a.x, a.y);
  ctx.lineTo(b.x, b.y);
  ctx.stroke();
};

drawingCanvas.onmousedown = function(e) {
  drawingCtx.clearRect(0, 0, drawingCanvas.width, drawingCanvas.height);
  curvePoints = [];
  drawing = true;
  curvePoints.push(getPoint(e));
};

drawingCanvas.onmouseup = function(e) {
  drawLine(
    drawingCtx,
    curvePoints[curvePoints.length - 1],
    curvePoints[0]
  );
  drawing = false;
  window.requestAnimationFrame(() => render(curvePoints));
};

drawingCanvas.onmousemove = function(e) {
  if (!drawing) return;
  curvePoints.push(getPoint(e));
  drawLine(
    drawingCtx,
    curvePoints[curvePoints.length - 2],
    curvePoints[curvePoints.length - 1]
  );
};