var po = require('./page-objects');
var ptor = protractor.getInstance();

describe('lean coffee', function() {
  var global = new po.GlobalFunction();

  describe('submit phase', function(){
    var meetingPage = new po.MeetingPage();

    it('should display my user name', function() {
      meetingPage.bypassEarlierPages();
      expect(meetingPage.userGreeting().getText()).toMatch(/You are: [\s\w]+/);
    });
      
    it('should display same user name after refresh', function(){
    	var userName = meetingPage.userGreeting().getText();
			browser.get('http://localhost:5000/#/meeting/Testing%20Meeting%20Name');
			expect(meetingPage.userGreeting().getText()).toEqual(userName);
    });

    it('should display the meeting participants', function(){
      expect(global.allparticipants.count()).toEqual(1);
      expect(global.getElementById('participantList').isPresent()).toBe(true);
    });

    it('should show the name of the meeting', function(){
        expect(meetingPage.meetingListText()).toContain(meetingPage.meetingName);
    });

    it('should allow a user to become a host', function(){
        var becomeHost = global.getElemByButtonText('Become a Host');
        var backToNormalUser = global.getElemByButtonText('Back to Normal User');

        expect(becomeHost.isDisplayed()).toEqual(true);
        expect(backToNormalUser.isDisplayed()).toEqual(false);

        becomeHost.click();

        expect(becomeHost.isDisplayed()).toEqual(false);
        expect(backToNormalUser.isDisplayed()).toEqual(true);

        backToNormalUser.click();
    });

    var author;
    var topics = [];

    it('should allow us submit a topic', function() {
        meetingPage.userGreeting().getText().then(function(userGreeting) {
          author = userGreeting.substring(9);
        });
        var allTopics;
        meetingPage.buildNineTopics(topics);
        allTopics = meetingPage.getTopics();
        expect(allTopics.count()).toBe(9);
    });

    it('should show all topics', function(){
      var allTopics = meetingPage.getTopics();
      expect(allTopics.get(0).getText()).toBe(topics[0]);
      expect(allTopics.get(1).getText()).toBe(topics[1]);
      expect(allTopics.get(2).getText()).toBe(topics[2]);
    });

    it('should show the remaining time for the phase', function(){
      expect(meetingPage.timerMinutes().getText()).not.toBeNull();
      expect(meetingPage.timerSeconds().getText()).not.toBeNull();
    });

    it('should show the name of the person who submitted the topic', function(){
      var allAuthors = meetingPage.getAuthors();

      allAuthors.get(0).getText().then(function(byline) {
       expect(byline.substring(4)).toBe(author);
      });
      allAuthors.get(1).getText().then(function(byline) {
        expect(byline.substring(4)).toBe(author);
      });
      allAuthors.get(2).getText().then(function(byline) {
        expect(byline.substring(4)).toBe(author);
      });
    });

    xdescribe('timer expires', function(){

        xit('should stop the timer at 0:00, and do nothing else', function(){

        });
    });

    it('should allow the host to transition to the next phase', function(){
        var becomeHost = global.getElemByButtonText('Become a Host');
        var nextPhase = global.getElemByButtonText('Next Phase →');
        expect(nextPhase.isDisplayed()).toEqual(false);
        becomeHost.click();
        expect(nextPhase.isDisplayed()).toEqual(true);
    });

    it('should show me if I am the host', function(){
       expect(global.allparticipants.count()).toEqual(1);
       expect(global.getElementById('participantIsHost').isPresent()).toBe(true);
       expect(global.getElementById('participantIsHost').getText()).toBe(' (H)');
    });

    it('should show who the hosts are', function(){
      expect(global.getParticipantElem(0, 'name').getText()).toContain('(H)');
      expect(global.getElementById('participantList').isPresent()).toBe(true);
    });

    it('should show a timer', function(){
      expect(meetingPage.timerMinutes().getText()).not.toBeNull();
      expect(meetingPage.timerSeconds().getText()).not.toBeNull();
    });

    xit('should allow the host to start the timer', function(){
      var secondsStart;

      meetingPage.timerSeconds().getText().then(function(seconds){
        seconds0 = seconds;
        expect(seconds0).toBe('00');
        return global.startTimer();
      }).then(function(){
        return browser.driver.sleep(5000);
      }).then(function(){
        return meetingPage.timerSeconds().getText();
      }).then(function(seconds1) {
        expect(seconds1).not.toBe('00');
      });
    });

    xit('should allow the host to reset the timer', function(){
      //global.clickElemByButtonText('Start');
      //expect(global.getElemByButtonText('Start').isDisplayed()).toEqual(false);
      //expect(global.getElemByButtonText('Stop').isDisplayed()).toEqual(true);
    });
  });
});
