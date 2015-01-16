var po = require('./page-objects');
var ptor = protractor.getInstance();

describe('lean coffee', function() {
  var global = new po.GlobalFunction();
  describe('voting phase', function(){

    var votingPage = new po.VotingPage();

    it('should allow you to navigate to the voting phase', function() {
      // global.goToNextPhase();
      votingPage.bypassEarlierPages();
      expect(global.getPhaseText()).toMatch(/PHASE: VOTING/);
    });

    it('should display an icon to vote up a topic', function(){
      expect(element(by.repeater('topic in meeting.topics').row(0)).$('.voteUp img').isPresent()).toBe(true);
    });

    it('should display an icon to vote down a topic', function(){
      expect(element(by.repeater('topic in meeting.topics').row(0)).$('.voteDown img').isPresent()).toBe(true);
    });

    it('should display the number of votes the user has remaining', function(){
      expect(global.getElementById('votesRemaining').getText()).toBe('You have 3 votes remaining.');
    });

    it('should allow a user to vote', function(){
      votingPage.voteUp(0);
      expect(global.getElementById('votesRemaining').getText()).toContain('2');
      expect(votingPage.getNumberOfVotesForTopic(0)).toContain('1');
    });

    it('should allow a user to vote up to 3 times', function(){
      votingPage.voteUp(1);
      expect(votingPage.getNumberOfVotesForTopic(1)).toContain('1');
      expect(global.getElementById('votesRemaining').getText()).toContain('1');
      votingPage.voteUp(1);
      expect(global.getElementById('votesRemaining').getText()).toBe('You have no votes remaining.');
    });

    it('should allow a user to change their votes', function(){
      votingPage.voteDown(1);
      expect(global.getElementById('votesRemaining').getText()).toContain('1');
      votingPage.voteDown(1);
      expect(global.getElementById('votesRemaining').getText()).toContain('2');
    });

    it('should allow a user to vote on up to 3 topics', function(){
      votingPage.voteUp(1);
      expect(global.getElementById('votesRemaining').getText()).toContain('1');
      votingPage.voteUp(2);
      expect(global.getElementById('votesRemaining').getText()).toBe('You have no votes remaining.');
      expect(votingPage.getNumberOfVotesForTopic(0)).toContain('1');
      expect(votingPage.getNumberOfVotesForTopic(1)).toContain('1');
      expect(votingPage.getNumberOfVotesForTopic(2)).toContain('1');
    });

    it('should allow a user to vote 3 times on a single topic', function(){
      votingPage.voteDown(1);
      expect(global.getElementById('votesRemaining').getText()).toContain('1');
      expect(votingPage.getNumberOfVotesForTopic(1)).toContain('0');
      votingPage.voteDown(2);
      expect(global.getElementById('votesRemaining').getText()).toContain('2');
      expect(votingPage.getNumberOfVotesForTopic(2)).toContain('0');
      votingPage.voteUp(0);
      votingPage.voteUp(0);
      expect(global.getElementById('votesRemaining').getText()).toBe('You have no votes remaining.');
      expect(votingPage.getNumberOfVotesForTopic(0)).toContain('3');
    });

    it('should display total number of remaining votes across all users to the host', function(){
      expect(global.getElementById('roomVotesRemaining').getText()).toBe('There are no votes remaining in the room.');
      votingPage.voteDown(0);
      expect(global.getElementById('roomVotesRemaining').getText()).toBe('There is 1 vote remaining in the room.');
      votingPage.voteDown(0);
      expect(global.getElementById('roomVotesRemaining').getText()).toBe('There are 2 votes remaining in the room.');
      votingPage.voteDown(0);
      expect(global.getElementById('roomVotesRemaining').getText()).toBe('There are 3 votes remaining in the room.');

    });

    it('should not display total number of remaining votes across all users to the normal users', function(){
      var becomeHost = global.getElemByButtonText('Become a Host');
      var backToNormalUser = global.getElemByButtonText('Back to Normal User');

      expect(becomeHost.isDisplayed()).toEqual(false);
      backToNormalUser.click();
      expect(becomeHost.isDisplayed()).toEqual(true);
      expect(backToNormalUser.isDisplayed()).toEqual(false);
      expect(global.getElementById('roomVotesRemaining').isDisplayed()).toBe(false);
      becomeHost.click();
    });

    it('should not allow a user to vote 4 or more times', function(){
      votingPage.voteUp(0);
      votingPage.voteUp(0);
      votingPage.voteUp(0);
      expect(global.getElementById('votesRemaining').getText()).toBe('You have no votes remaining.');
      expect(votingPage.getNumberOfVotesForTopic(0)).toContain('3');
      // expect(element(by.id('recaptcha_image')).isPresent()).toBe(true);
      var voteUpElement = element(by.repeater('topic in meeting.topics').row(0)).$('.vote').$('.voteUp');
      expect(voteUpElement.getAttribute('class')).toContain('hidden');
    });
		
		it('should not reset amount of votes on refresh', function(){
			browser.get(ptor.getCurrentUrl());
      expect(global.getElementById('votesRemaining').getText()).toBe('You have no votes remaining.');
      expect(votingPage.getNumberOfVotesForTopic(0)).toContain('3');
		});

    xit('should allow the host to manually start the phase timer', function(){

    });

    xit('should show the remaining time for the phase', function(){

    });

    describe('timer expires', function(){

        xit('should stop at 0:00, but do nothing else', function(){

        });
    });
  });
});
