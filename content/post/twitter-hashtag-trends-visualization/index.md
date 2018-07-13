---
date: 2013-10-23
---

# Twitter hashtag trends visualization

For my 480c term project I knew I wanted to do some sort of data visualization. At the time, I was inspired by Christopher Domas' binary visualization tool [..cantor.dust..](http://www.youtube.com/watch?v=4bM3Gut1hIk) and how it could show patterns in otherwise random looking data. I began to wonder if the same technique could be somehow applied to visualize Twitter trends but decided Twitter's data just isn't applicable in the same way.

I settled on displaying hashtag trends by plotting each hashtag as a line sequence in 3D space. Viewers are able to observe changes in a hashtag's sentiment score and popularity over time:

<iframe width="960" height="580" src="//www.youtube.com/embed/nMYonyttHbs?rel=0" frameborder="0" allowfullscreen></iframe>

## Use case
The visualization is more about viewing hashtags relative to each other than getting hard numbers on them. Like Domas' binary visualization, it's a good place to start when looking for trends and that's the primary use case.

It's difficult to see the big picture when we're just watching a stream of tweets. What if we want to know how popular hashtags are relative to each other, and when did they start geting popular? What do people care about the most? Which hashtags are related? To answer these questions without a visualization could be very time consuming, so I sought to make the answers more accessible.

## Understanding the data
The visualization lends itself to quickly identifying correlated hashtags. A spike common to multiple hashtags may mean those hashtags are related, and this helps the user learn the meaning of hashtag names without having to Google it. Multiple lines following exactly the same path for a short time is an indication of a single tweet being retweeted en masse.

The popularity scale is logarithmic because the tool isn't intended to provide hard data. Like Domas' tool, it's a starting place. I think its strength is in taking advantage of peoples inate ability to understand visual patterns.

## Implementation
Full source code for the project can be found [on Github](https://github.com/csauve/twitter-trends).

The project consists of 3 main components. The first is a python script that collects tweets from the [Twitter sample stream](https://dev.twitter.com/docs/api/1.1/get/statuses/sample). The script collects tweets over the course of 10 minutes and, for each hashtag encountered in those 10 minutes, calculates:

* The number of tweets the hashtag appeared in.
* The average sentiment of the tweets the hashtag appeared in.

Along with the current date/time, we have a 3D point representing the popularity and sentiment of a certain hashtag over the previous 10 minutes. I found that 10 minutes is long enough to smooth out the noise, but short enough to get a decent resolution of features.

This information is then posted by the script to a [node.js](http://nodejs.org/) server, which stores it in a [MongoDB](http://www.mongodb.org/) database. The server both provides an API for the data and serves the client application which visualizes the data. I used [AngularJS](http://angularjs.org/) as the base framework of the client with help from [moment.js](http://momentjs.com/) and [Zepto.js](http://zeptojs.com/). For the 3D visualization itself, [three.js](http://threejs.org/) was great to work with.
