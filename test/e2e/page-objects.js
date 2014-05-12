var random = function (min, max) {
    return Math.floor(Math.random()*(max-min+1)+min);
};

module.exports.HomePage = function() {
    this.meetingName = 'test' + random(1000,2000);

    this.meetingInput = element(by.model('meetingName')),
    this.createMeetingButton = element(by.buttonText('Create a Meeting!')),

    this.get = function() {
        browser.get('http://localhost:5000/');
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
    this.userGreeting = function() {
        return element(by.binding('user'));
    };

    this.meetingListText = function() {
        return $('.meeting-list').getText();
    };

    this.postTopic = function() {
      var topic = "test topic " + random(10000, 90000);

     for(var i=1; i<10; i++){
      element(by.model('userTopic.body')).sendKeys('Hello'+i);
      element(by.buttonText('Speak Up!')).click();
     }
   }

  this.goToMergePhase = function() {
    element(by.buttonText('Next Phase →')).click();
  };

    this.getTopics = function() {
      var topics = [];

      return topics;
    };
};
module.exports.MergePage = function() {

 };

 module.exports.GlobalFunction = function() {

  this.allTopics = element.all(by.repeater('topic in meeting.topics'));
  this.getTopicElem = function(rowNum, columnNum){
   return element(by.repeater('topic in meeting.topics').row(rowNum).column(columnNum));
  }

   this.getElementById = function(idValue){
    return element( by.css('[id='+idValue+']'));
  }

  this.clickElemById = function(id){
    this.getElementById(id).click();
  }

  this.getElemByButtonText = function(buttonText){
    return element(by.buttonText(buttonText));
  }

  this.clickElemByButtonText= function(buttonText){
    this.getElemByButtonText(buttonText).click();
  }

  this.getElementByModel = function(modelValue){
    return element(by.model(modelValue));
  }

};
