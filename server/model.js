var allNames = [
  'Mayor McCheese','Hamburgler','Strawberry Shortcake','Xena, Warrior Princess','Kruul the Warrior King','Hippie','Mr. Drippy',
  'Master Shake','Grimmace','Sailor Moon','Blue','A Fish Called Wonda','Mr. Pink','Marsellus Wallus','Tony Stark','Justin Beiber',
  'Bubble Puppy','Dora the Explorer','Spongebob Squarepants','Moonpie','Smores','Onyx','Uncle Bob','Godzilla',
  'McLovin','Sparky, the Fire Breathing Chameleon','The Tin Man', 'Magic Mike', 'Squared', 'MD', 'Darth Helemet', 'President Scroob',
  'Glass Popcorn', 'Kobe', 'Pierre the Pelican', 'The Dunstan', 'Secret Squirrel', 'Luigi', 'Yoda', 'Jar Jar Binks',
  'Nemo', 'Dory', 'Toothless', 'Hiccup', 'Professor X', 'Dark Phoenix', 'Not a Bug', 'A Feature', 'Troll', 'Vincent Vega'
];

var randomName = function(allNames){
  return allNames[Math.floor((Math.random()*allNames.length))];
};

function getNewName(meeting){
  var name;
  if(meeting.participants.length > 48){
    return Math.floor(Math.random() * 10000000);
  }
  do{
    name = randomName(allNames);

  } while (!isNameFree(name, meeting.participants))

  return name;
}

// This User object must be able to persist across browser resets.
function User(name, meetingName, socketId){
    this.name = name;
    this.meetingName = meetingName;
    this.socketId = socketId || "";
    this.isHost = false;
    this.votesRemaining = 3; // This is a bug, refresh browser resets your votes.
    this.votedOn = [];
    this.disconnected = false;
}

function Vote(type, user){
  this.type = type || 'stop';
  this.user = user;
}

var numTopics = 0;
function Topic(topic){
  var moment = require('moment');
  this.id = numTopics++;
  this.body = topic.body || '';
  this.voters = topic.voters || [];
  this.author = topic.author;
  this.continue = topic.continue || [];
  this.stop = topic.stop || [];
  this.current = false;
  this.timer = moment.duration(3, 'minutes');
  this.votes = function(){
    return this.voters.length;
  };

  this.shouldContinue = function(){
    var stopVotes = this.stop.length;
    var goVotes = this.continue.length;
    return {
      decision: stopVotes >= goVotes ? 'stop' : 'continue',
      stopVotes: stopVotes,
      goVotes: goVotes
    }
  }

  this.hasContinueVoted = function(user){
    return this.continue.concat(this.stop).some(function(vote){
      if(vote.user == user) return true;
    });
  }

  this.addContinueVote = function(vote){
    if(vote.type == 'continue'){
      this.continue.push(vote);
    } else {
      this.stop.push(vote);
    }
  };

  this.reset = function(){
    this.continue = [];
    this.stop = [];
    this.timer = moment.duration(this.timer.minutes() / 2, 'minutes');
  };
}

function isNameFree(searchTerm, myArray) {
    for(var i = 0, len = myArray.length; i < len; i++) {
      if (myArray[i].name === searchTerm){
        return false;
      }
    }
  return true;
}


module.exports = {
    getNewName: getNewName,
    User: User,
    Vote: Vote,
    Topic: Topic
}
