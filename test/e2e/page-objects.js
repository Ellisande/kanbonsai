var random = function (min, max) {
    return Math.floor(Math.random()*(max-min+1)+min);
};

// var waitForTextGenerator = function*(we) {
//   we.getText(function(text){
//     yield text;
//   });
// };
//
// module.exports.waitForText = function(webElement) {
//   var gen = waitForTextGenerator(webElement);
//   return gen.next().value;
// };

module.exports.HomePage = function() {
    this.meetingName = 'test' + random(1000,2000);

    this.meetingInput = element(by.model('meetingName')),
    this.createMeetingButton = element(by.buttonText('Create a Meeting!')),

    this.get = function() {
        browser.get('http://localhost:5000/');
    };

    this.setMeetingNameInput = function(name) {
      this.meetingInput.sendKeys(name);
    };

    this.createMeeting = function() {
        this.meetingInput.sendKeys(this.meetingName);
        this.createMeetingButton.click();
    };

    this.getMeetingName = function() {
        return this.meetingName;
    };
};

module.exports.MeetingPage = function() {
    this.meetingName;
    this.userGreeting = function() {
        return element(by.binding('user'));
    };

    this.bypassEarlierPages = function() {
      var homePage = new module.exports.HomePage();
      homePage.get();
      homePage.createMeeting();
      this.meetingName = homePage.getMeetingName();
    };

    this.buildNineTopics = function(topics) {
      for(var k=1; k< 10;k++){
        topics.push(this.postTopic());
      }
    };

    this.meetingListText = function() {
        return $('.meeting-list').getText();
    };

    this.timerMinutes = function() {
      return element(by.binding('duration.minutes() | timer'));
    };

    this.timerSeconds = function() {
      return element(by.binding('duration.seconds() | timer'));
    };

    this.postTopic = function() {
      var topic = "test topic " + random(10000, 90000);
      element(by.model('userTopic.body')).sendKeys(topic);
      element(by.buttonText('Speak Up!')).click();

      return topic;
   };

  this.goToMergePhase = function() {
    element(by.partialButtonText('Next')).click();
  };

    // returns a promise of an array of WebElements (see: https://github.com/angular/protractor/blob/master/docs/api.md#elementall)
    this.getTopics = function() {
      return element.all(
        by.repeater('topic in meeting.topics')
        .column('{{topic.body}}')
      );
    };

    // returns a promise of an array of WebElements (see: https://github.com/angular/protractor/blob/master/docs/api.md#elementall)
    this.getAuthors = function() {
      return element.all(
        by.repeater('topic in meeting.topics')
        .column('{{topic.author}}')
      );
    };
};
module.exports.MergePage = function() {
  this.meetingName;
  this.bypassEarlierPages = function(topics) {
    var meetingPage = new module.exports.MeetingPage();
    meetingPage.bypassEarlierPages();
    meetingPage.buildNineTopics(topics);

    var global = new module.exports.GlobalFunction();
    global.becomeHost();
    global.goToNextPhase();
    this.meetingName = meetingPage.meetingName;
  };

};

 module.exports.VotingPage = function() {
   this.meetingName;
   this.bypassEarlierPages = function() {
     var topics = [];
     var mergePage = new module.exports.MergePage();
     mergePage.bypassEarlierPages(topics);
     new module.exports.GlobalFunction().goToNextPhase();
     this.meetingName = mergePage.meetingName;
   };

   this.voteUp = function(rowNum) {
     element(by.repeater('topic in meeting.topics').row(rowNum)).$('.voteUp').click();
   };

   this.voteDown = function(rowNum) {
     element(by.repeater('topic in meeting.topics').row(rowNum)).$('.voteDown').click();
   };

   this.getNumberOfVotesForTopic = function(rowNum) {
     return element(by.repeater('topic in meeting.topics').row(rowNum)).$('.vote').getText();
   };
 };

 module.exports.DiscussPage = function(){
	this.meetingName;
  this.bypassEarlierPages = function() {
    var votingPage = new module.exports.VotingPage();
    votingPage.bypassEarlierPages();
    new module.exports.GlobalFunction().goToNextPhase();
		this.meetingName = votingPage.meetingName;
  };

  this.nextTopic = function(){
    $('.current .next-topic').click();
  };

  this.clickFirstTopic = function(){
    return element.all(by.repeater('topic in meeting.topics').column('{{topic.author}}')).first().click();
  };

  this.getFirstNotes = function(){
    return element.all(by.repeater('topic in meeting.topics')).first().findElement(by.textarea('topic.notes'));
  };

  this.getTopics = function() {
    return element.all(
      by.repeater('topic in meeting.topics')
    );
  };

  this.continueButton = function(){
    //return element(by.repeater('topic in meeting.topics').row(0));
			 //element(by.repeater('topic in meeting.topics').$('.current vote-up'))
			 return $('.current .vote-up');
  };

  this.stopButton = function(rowNum){
    //element(by.repeater('topic in meeting.topics').row(rowNum)).$('.stop');
			return $('.current .vote-down');
  };

  this.continueVote = function(){
    return this.continueButton().click();
  };

  this.stopVote = function(){
    return this.stopButton().click();
  };

  this.continueText = function(){
    return $('.continue');
  };

  this.stopText = function(){
    return $('.stop');
  };

  this.getTopicVotes = function() {
    return element.all(
      by.repeater('topic in meeting.topics')
      .column('{{topic.voters.length}}')
    );
  };
};

module.exports.CompletePage = function() {
  var topicCount;
  var firstNote;

   this.bypassEarlierPages = function() {
   var discussPage = new module.exports.DiscussPage();
    discussPage.bypassEarlierPages();
    discussPage.clickFirstTopic();
    var notesElement = discussPage.getFirstNotes();
    notesElement.sendKeys('These are notes');

    topicCount = (discussPage.getTopics()).count();
    firstNote = (discussPage.getFirstNotes()).getAttribute('value');
    new module.exports.GlobalFunction().goToNextPhase();
  };

  this.getAllTopicsCount = function() {
       return topicCount;
  };

  this.getFirstNotes = function(){
    return firstNote;
  };

  this.getAllMeetings = function(){
    return element.all(
      by.repeater('meeting in meetings')
      .column('{{meeting.name}}')
    );
  }

};

 module.exports.GlobalFunction = function() {

   this.goToNextPhase = function() {
     return element(by.partialButtonText('Next')).click();
   };

   this.getPhaseText = function() {
     return element(by.binding('meeting.phase')).getText();
   };

  this.allSubmitTopics = element.all(by.repeater('topic in meeting.topics'));

  this.getTopicElem = function(rowNum, columnNum){
   return element(by.repeater('topic in meeting.topics').row(rowNum).column(columnNum));
 };

  this.allparticipants = element.all(by.repeater('participant in meeting.participants'));
  this.getParticipantElem = function(rowNum, columnNum){
   return element(by.repeater('participant in meeting.participants').row(rowNum).column(columnNum));
 };

  this.getElementById = function(idValue){
    return element( by.css('[id='+idValue+']'));
  };

  this.clickElemById = function(id){
    this.getElementById(id).click();
  };

  this.getElemByButtonText = function(buttonText){
    return element(by.buttonText(buttonText));
  };

  this.clickElemByButtonText= function(buttonText){
    this.getElemByButtonText(buttonText).click();
  };

  this.getElemByModel = function(modelValue){
    return element(by.model(modelValue));
  };

  this.becomeHost = function() {
    var becomeHostButton = element(by.id('hostToggleOff'));
    if (becomeHostButton) {
      return becomeHostButton.click();
    } else {
      return null;
    }
  };

  this.startTimer = function() {
    return element(by.id('startTimer')).click();
  };

  this.stopTimer = function() {
    return element(by.id('stopTimer')).click();
  };

};
