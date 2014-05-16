var po = require('./page-objects');

describe('discuss phase', function(){

    var global = new po.GlobalFunction();
    var discussPage = new po.DiscussPage();
    var meetingPage = new po.MeetingPage();

    it('should allow navigation to the discuss phase', function(){
      discussPage.bypassEarlierPages();
      expect(global.getPhaseText()).toMatch(/PHASE: DISCUSS/);
    });

    it('should order the topics by number of votes', function(){
      var topics = discussPage.getTopicVotes();
      topics.each(function(topic){
        var lastNumVotes = Number.MAX_VALUE;
        topic.getText().then(function(numVotes){
          var votes = numVotes.substring(1);
          expect(lastNumVotes >= votes).toEqual(true);
          lastNumVotes = votes;
        });
      });
    });

    it('should show the active topic', function(){
      var topics = discussPage.getTopics();
      topics.get(0).getAttribute('class').then(function(classes){
        expect(classes).toContain('current');
      });
    });

    it('should show the remaining time to discuss the active topic', function(){
      var timerMinutes = meetingPage.timerMinutes();
      var timerSeconds = meetingPage.timerSeconds();
      timerMinutes.getText().then(function(minutes){
        expect(minutes).toEqual('03 :');
      });

      timerSeconds.getText().then(function(seconds){
        expect(seconds).toEqual('00');
      });
    });

    it('should allow the host to advance to the topic forcibly', function(){
      discussPage.nextTopic();
      var topics = discussPage.getTopics();
      topics.get(0).getAttribute('class').then(function(classes){
        expect(classes).not.toContain('current');
      });
      topics.get(1).getAttribute('class').then(function(classes){
        expect(classes).toContain('current');
      });

    });

    describe('timer expires', function(){

        xit('should allow you to vote to continue discussing this topic 15 seconds prior to expiration', function(){

        });

        it('should allow you to vote to keep talking about a topic', function(){
          expect(discussPage.continueButton().isDisplayed()).toEqual(true);
          discussPage.continueVote();
          expect(discussPage.continueButton().isDisplayed()).toEqual(false);
          expect(discussPage.stopButton().isDisplayed()).toEqual(false);
        });

        describe('vote is to continue talking' , function(){

            it('should display the continue is winning', function(){
              expect(discussPage.continueButton().isDisplayed()).toEqual(false);
              expect(discussPage.stopButton().isDisplayed()).toEqual(false);
              expect(discussPage.continueText().isDisplayed()).toEqual(true);
              discussPage.continueText().getText().then(function(text){
                expect(text).toEqual('Continue is Winning');
              });

            });

            xit('should automatically add half of the duration to the clock', function(){

            });

        });

        it('should allow you to vote to stop talking about a topic', function(){
          discussPage.nextTopic();
          expect(discussPage.stopButton().isDisplayed()).toEqual(true);
          discussPage.stopVote();
          expect(discussPage.continueButton().isDisplayed()).toEqual(false);
          expect(discussPage.stopButton().isDisplayed()).toEqual(false);
        });

        describe('vote is to stop talking about the current topic' , function(){
            it('should display the continue is winning', function(){
              expect(discussPage.continueButton().isDisplayed()).toEqual(false);
              expect(discussPage.stopButton().isDisplayed()).toEqual(false);
              expect(discussPage.stopText().isDisplayed()).toEqual(true);
              discussPage.stopText().getText().then(function(text){
                expect(text).toEqual('Stop is Winning');
              });
            });

            xit('automatically move to the next topic', function(){

            });

        });

        describe('the vote to continue is tied or no one votes', function(){

            it('should stop on tie', function(){
              discussPage.nextTopic();
              expect(discussPage.stopText().isDisplayed()).toEqual(true);
            });
        });

    });

    describe('tie breakers', function(){

        xit('should sort ties by creation timestamp', function(){

        });

    });

    describe('notes', function(){
        it('should allow all users to take peronsal notes on active topic', function(){
          discussPage.clickFirstTopic();
          var notesElement = discussPage.getFirstNotes();
          notesElement.sendKeys('These are notes');
          notesElement.getAttribute('value').then(function(notes){
            expect(notes).toEqual('These are notes');
          });
        });
    });
});
