---
date: 2013-10-20
title: "Target visibility detection for GuiltySpark: Part 1"
---

So we have a bot that can [navigate around the map](/post/guiltyspark-navigation) and [make its own decisions](/post/guiltyspark-scripting), but it's pretty dumb if it can't tell whether or not the target it's aiming at is visible or not. In other words, it needs to know if the line between itself and an opponent player is occluded by level geometry.

There is a location in Halo's memory that says if you're looking at an opponent. There must be, because when you do it your reticule turns red and the player's name shows up on the screen.

![](fade.jpg)

There has to be a value change somewhere to accompany this state!

<iframe width="560" height="315" src="//www.youtube.com/embed/E2sCu67cTEE" frameborder="0" allowfullscreen></iframe>


[Cheat engine](http://www.cheatengine.org/) is a tool employed by reverse engineers and memory hackers to find such memory addresses within a process. The premise is simple: take a snapshot of the game's memory, make a change in-game (or don't), then take another snapshot and compare the differences (or lack thereof). After a good number of filterings you can reduce the number of addresses down to a manageable number if not a single address. Here's something like the process I used:

1. Host an empty password-protected server. Invite someone you know to join the server and stand still
3. Scan the game memory once to get a base snapshot
4. While facing away from the friend or at the friend, repeatedly filter by values that have not changed. This will eliminate lots of addresses where the value changes all the time
5. When changing if we're facing the friend or not, filter by values that *did* change. This will eliminate lots of addresses where the value does not change often
6. Repeat 4 and 5 dozens of times to remove addresses that follow our criteria by fluke
7. Filter by addresses that don't change after doing a number of unrelated actions in-game, like driving vehicles, dying, firing weapons, etc. The more disruptive the better
8. Attempt to remove addresses correlated to your goal, such as aim direction

So I ended up finding the location storing the opacity of the name tag. When the value there is not 0, then the name is visible and therefore the bot must be looking at an opponent.

## Problem solved, right?
Not quite. This is the solution I settled on for a long time but was never happy with. The name tag only appears when you're within a certain distance of the target, even if you're looking right at them. Secondly, you must be looking more or less exactly at the target, which is a problem for Halo PC because you need to aim where the target will be in 100-200 ms to compensate for server-side hit detection that does not consider network latency.

The aimbot I created for GuiltySpark was already capable of leading targets based on travel time of the projectile, target speed, and network latency, but this often meant the bot wasn't looking directly at the target and the name tag didn't show up:

![](lead.jpg)

## A better way
I knew that Halo stored its level geometry as a [BSP tree](http://en.wikipedia.org/wiki/Binary_space_partitioning) because I had worked with the Halo Editing Kit (HEK). What if I could extract that BSP from memory and cast rays to test visibility?

It was known in the Halo modding community that game assets are compiled into *tags* of various types. For example, a vehicle tag would contain physics data and have references to other tags like shaders, models, animations, effects, etc. The HEK allowed me to understand the structure of tags, and I could compare that to what I saw in cheat engine.

It was already known that Halo loaded its map cache data at the address `0x40440000`, so that's where I started:

[![](taglist.jpg)](taglist.jpg)

A list of tags starts 0x10 from the start. Note how each tag can be identified by its type, like "mtib" being a backwards abbreviation for "bitmap" or "ihcsrdhs" being a chicago shader. What I need to do is scan through the list to find the "sbsp" tag, then follow its data pointer to get the actual BSP data.

Examining the "scenario structure BSP tags" with the HEK made it easier to understand the sbsp tag in memory:

[![](BSP3DNODE.JPG)](BSP3DNODE.JPG)

After a lot of research, I was finally able to reverse engineer the layout of the BSP and extract it using [ReadProcessMemory](http://msdn.microsoft.com/en-ca/library/windows/desktop/ms680553%28v=vs.85%29.aspx) into my own data structures.

[![](bspmemory.jpg)](bspmemory.jpg)

## Using the BSP
A BSP tree recursively subdivides a sealed space in half using planes until the set of surfaces in the node are convex. If I remember right, Halo seems to do this at map compilation time by randomly choosing a polygon in the space to define the splitting plane. Ideally, the split should equally divide the number of polygons in the space but choosing a good plane for this could be expensive and add time to map compilation.

To determine if a surface occludes the ray between two players, start at the root node of the BSP tree and see if both the player and the target are on the same side as the dividing plane. If yes, then recurse on the child node corresponding to the side of the plane they're on (front or back). Otherwise, stop when the plane divides the two points. This means that all leaves under the node could potentially block the ray between player and target, and have to be checked:

![](bsp0.jpg)
![](bsp1.jpg)
![](bsp2.jpg)
![](bsp3.jpg)

For now, this covers the general idea of extracting the BSP and using it to test target visibility. Please [check out part 2](/post/guiltyspark-visibility-detection-part-2) if you're interested in more implementation details.
