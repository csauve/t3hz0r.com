---
date: 2014-04-11
---

# Time-lapse and WebM test

You'll need a browser with at least native WebM support to view this video, like Firefox, Chrome, or Opera. [Read more on WebM support here](http://en.wikipedia.org/wiki/WebM#Software).

The workflow for creating this was:

1. Use Magic Lantern intervalometer to take 10s exposure every 10s. Left this going for about 20 minutes until I lost my game of [2048](http://gabrielecirulli.github.io/2048/)
2. Import raw sequence into After Effects for colour grading and render
3. Converted video to WebM with [ffmpeg](http://www.ffmpeg.org/): `ffmpeg -i input.avi -c:v libvpx -crf 4 -b:v 15000K out.webm`

15000K being your bitrate, and -crf being quality from 4 (best) to 26.


<video src="output.webm" loop controls style="width: 100%">
Looks like your browser doesn't support WebM :(
</video>

Notes:
* There's a random all blue frame part way through the video. Not sure how that happened, but it's something I'll have to screen for in the future
* At 24 fps, I only got a few seconds of video from 20 minutes of shooting. Be more patient!
* Drastic changes in lighting are distracting when you can't see the whole landscape

On the whole though, I like the result and I'll have to try this more often.