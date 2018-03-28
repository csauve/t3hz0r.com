# Intro to GuiltySpark: Autonomous Halo bot
<time>2013-10-19</time>

I'm an avid player of the PC game *Halo*, and I spent over 6 years involved in its modding community. One of my ventures during that time was to create a program that played the game on its own. And I wanted to accomplish this goal without modifying the game at all.

PC gamers may be familiar with [trainers](http://en.wikipedia.org/wiki/Trainer_(games)). They're small, standalone applications that write to the memory of a running game and alter its behaviour, typically used for cheating. Building trainers requires knowledge of the game's memory layout so the right addresses can be written to. Of course, you can also read from these addresses and get information out of the game. I decided I would take this approach, called "Memory Hacking", to building the bot.

## The idea
When I first came up with this idea, I was still a novice programmer in my first year at UVic. The first rudimentary proof of concept was a Java application that simulated a held down W key (mapped to "walk forwards" in Halo) and regularly read the player's XYZ world coordinates out of memory. This was done with a JNI binding to windows system calls. When the bot detected that the player's velocity had dropped below a threshold, it assumed the player had walked into an obstacle and simulated a random horizonal movement of the mouse to get the player walking in another direction.

If you left this bot running for a few hours, it would randomly bounce around the map, printing out a grid of spaces and "#" to console representing a map of obstacles encountered. The bot had microbe-level intelligence, but demonstrates the idea well: read information from game memory, make decisions, and then simulate keyboard and mouse input. Repeat.

## Improving
I spent much of my summer and fall in 2010 working on a new version written in C# to help myself learn the language. Using .NET also let me more easily use Windows system calls to do the memory hacking and input simulation. This new version [quickly became complex](arch.png) and richly featured; the bot could now navigate around the game levels by itself to reach targets, shoot at other players, and determine which of its two weapons to use in certain situations. It could even judge ballistic trajectories for throwing grenades at moving targets. All of this was still built within the same framework as the original proof-of-concept:

1. Read information from game memory
2. Use the information to make a decision
3. Act on the decision by simulating user input
4. Repeat

However, I think the best feature was that the bot was that step 2 was user-programmable. For example, one could create a bot that simply followed other players around, or that walked along a set path. The behaviours could be very complex, to the point of playing like a human might:

<iframe width="640" height="480" src="//www.youtube.com/embed/SpogBHQXg5k" frameborder="0" allowfullscreen></iframe>

The bot is about as "skilled" as the average Halo PC player. Read more about [the GuiltySpark scripting engine](/post/guiltyspark-scripting).

Navigation is done by path finding on a pre-built navigation graph, then simulating combinations of the W, A, S, and D keys to move the player along the path independently of what direction it's facing. I have a post discussing the [navigation system](/post/guiltyspark-navigation) specifically.

A big problem I had during implementation was how to determine if the target player is visible or not. Read about my [work to improve visibility detection](/post/guiltyspark-visibility-detection-part-1) using ray casting and level geometry extraction.