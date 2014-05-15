var allNames = [
  'Mayor McCheese','Hamburgler','Strawberry Shortcake','Xena, Warrior Princess','Kruul the Warrior King','Hippie','Mr. Drippy',
  'Master Shake','Grimmace','Sailor Moon','Blue','A Fish Called Wonda','Resivior Dog','Marsellus Wallus','Tony Stark','Justin Beiber',
  'Bubble Puppy','Dora the Explorer','Spongebob Squarepants','Moonpie','Smores','Onyx','Uncle Bob','Godzilla',
  'McLovin','Sparky, the Fire Breathing Chameleon','The Tin Man', 'Magic Mike', 'Squared', 'MD', 'Darth Helemet', 'President Scroob',
  'Glass Popcorn', 'Kobe', 'Pierre the Pelican', 'The Dunstan', 'Secret Squirrel', 'Luigi'
];

var randomName = function(allNames){
  return allNames[Math.floor((Math.random()*allNames.length))];
};

function getNewName(meeting){
  var name;
  do{
    name = randomName(allNames);

  } while (!isNameFree(name, meeting.participants))

  return name;
}
function User(name, meetingName, socketId){
    this.name = name;
    this.meetingName = meetingName;
    this.socketId = socketId || "";
    this.isHost = false;
    this.votesRemaining = 3;
    this.votedOn = [];
}

function Vote(type, user){
  this.type = type || 'stop';
  this.user = user;
}

var numTopics = 0;
function Topic(topic){
  this.id = numTopics++;
  this.body = topic.body || '';
  this.voters = topic.voters || [];
  this.author = topic.author;
  this.continue = topic.continue || [];
  this.current = false;
  this.votes = function(){
    return this.voters.length;
  };

  this.goVotes = function(){
    var sum = 0;
    this.continue.forEach(function(vote){
      if(vote.type == 'go') sum++;
    });
    return sum;
  };

  this.stopVotes = function(){
    var sum = 0;
    this.continue.forEach(function(vote){
      if(vote.type == 'stop') sum++;
    });
    return sum;
  };

  this.shouldContinue = function(){
    var stopVotes = this.stopVotes();
    var goVotes = this.goVotes();
    return {
      decision: stopVotes >= goVotes ? 'stop' : 'go',
      stopVotes: stopVotes,
      goVotes: goVotes
    }
  }

  this.hasContinueVoted = function(user){
    return this.continue.some(function(vote){
      if(vote.user == user) return true;
    });
  }
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
