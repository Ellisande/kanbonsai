# Lean Coffee

## Introduction
There is a new style of meeting that is gaining tracition amongst large organizations called Lean Coffee. Lean Coffee is a way to approach meetings that have no strongly defined agenda.

### Basic Process
The process of Lean Coffee follows these basic steps:

* Everyone submits topics (2-3 mintues)
* Similar topics are merged (1-2 minutes)
* Everyone votes on the topics (1-3 minutes)
 * Each person has 3 votes they can use any way they like
* Main body of the meeting
 * Take the topic with the most votes
 * Talk about the topic (3 minutes)
 * At the end of three minutes everyone votes on whether or not to continue talking about the topic
  * If they vote yes, keep talking (time is reduced by half)
  * If they vote no, remove the topic and repeat the main body steps again
* Main body is repeated until the meeting is over

### Benefits
Lean Coffee has a couple of great benefits from a meeting perspective.

* __Simplicity__ - The rules are very simple to explain and understand
* __Efficiency__ - The topics with the most interest are talked about first, and for the longest
* __Focused__ - Each topic is talked about only while there is overwhelming interest, reducing swirl
* __Dynamic__ - Lean Coffee allows you to have productive meetings even when it is implausible or impossible to create detailed agendas ahead of time.


## Getting Started (simple)

* __Go to the Site__ - navigate to http://www.lean-coffee.com
* __Join a Meeting__ - either choose an existing meeting from the left-hand side, or create a new meeting.
* __Invite your Friends__ - simply copy the meeting URL (e.g. http://lean-coffee.com/meeting/myMeeting) and share it with the other participants.
* __Enjoy the Meeting!__

## Getting Started (advanced)

If you are interested in setting up your own Lean Coffee server, its quick and easy!

* __Download Node__ - Lean coffee is a node based application, you'll need NodeJs and NPM (npm is packaged with Node)
 * http://nodejs.org
* __Checkout the Code__ - Lean coffee is publicly available on Github. You just need to clone the repository
 * __Download Git__ - http://git-scm.com
 * __Clone the Repository__ - ```git clone https://github.com/Ellisande/lean-coffee```
* __Install the Dependencies__ - Npm makes this quick and easy. Simply run the following command:
 * ```npm install```
* __Run the Server__ - Gulp JS is configured to run the application just run ```gulp```

Your server should be all setup and running, now to try a meeting!

* __Go to the Site__ - navigate to http://localhost:5000
* __Join a Meeting__ - either choose an existing meeting from the left-hand side, or create a new meeting.
* __Invite your Friends__ - simply copy the meeting URL and share it with the other participants.
* __Enjoy the Meeting!__
