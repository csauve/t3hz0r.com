---
date: 2018-04-03
---

# Visualizing closed curve inscribed lines

I was watching a [3Blue1Brown video](https://www.youtube.com/watch?v=AmgkSdhK4K8) about the "inscribed rectangle problem" and was curious how representing inscribed lines might help reason about finding inscribed squares for a jordan curve.

To summarize, a [_jordan curve_](https://en.wikipedia.org/wiki/Jordan_curve_theorem) is a non-intersecting continuous curve on the plane. An inscribed square is a squre drawn over such a curve where each corner lies on the curve. Apparently it's unknown if they always exist, whereas it's known an inscribed _rectangle_ does always exist. What I found amazing about the proof presented in the video was that intuitive insights came from changing the representation of the problem.

The problem got me thinking -- how else might you represent an inscribed square? How about inscribed lines?

## Visualizing line slopes
The closed curve can be treated like a parametric curve where a point is parameterized by some value `t` in the range `[0, 1)`. So, any pair of points can be represented as a tuple `(t1, t2)`. All pairs of points can be represented on the plane, where the colour of that point is determined by the slope of the line between those two lines. Perpendicular lines will have "opposite" colours.

When the curve can be drawn arbitrarily, some interesting output is produced. Try it yourself!

<figure class="canvas-section">
  <noscript>Please enable JavaScript for this demo to function</noscript>
  <section>
    <figcaption>Draw a curve here, then wait a bit...</figcaption>
    <canvas style="border:1px solid black" id="drawing-canvas" width="256" height="256"></canvas>
  </section>

  <section>
    <figcaption>Inscribed line slopes:</figcaption>
    <canvas style="border:1px solid black" id="angle-canvas" width="256" height="256"></canvas>
  </section>

  <section>
    <figcaption>Inscribed line lengths:</figcaption>
    <canvas style="border:1px solid black" id="length-canvas" width="256" height="256"></canvas>
  </section>
</figure>

## Conclusions
What can be interpreted from the above? I wasn't really trying to solve the _inscribed square problem_, but the output does exhibit some neat properties. You can begin to get a sense of the input curves by studying their outputs alone. Perhaps there is something that can be proven about the outputs based on the input curve?

If anything, it's a cool visualization and I had a lot of fun playing with it after building. [Source is available here](inscribed-lines.js). Since the output of each pixel is independent of the others, there is definitely opportunity to speed up drawing by sending curve data to the GPU and rendering each output pixel in parallel, allowing for higher resolution outputs.

<script src="inscribed-lines.js"></script>