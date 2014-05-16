var po = require('./page-objects');
var ptor = protractor.getInstance();

describe('lean coffee', function() {
  var global = new po.GlobalFunction();

  describe('discuss phase', function(){

    var discussPage = new po.DiscussPage();

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
      discussPage.nextTopic();
      var topics = discussPage.getTopics();
      topics.get(0).getAttribute('class').then(function(classes){
        expect(classes).toContain('current');
      });
    });

    xit('should show the remaining time to discuss the active topic', function(){

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

        describe('vote is to stop talking about the current topic' , function(){

            xit('automatically move to the next topic', function(){

            });

        });

        describe('vote is to continue talking' , function(){

            xit('should automatically add half of the duration to the clock', function(){

            });

        });

        describe('the vote to continue is tied or no one votes', function(){

            xit('should stop on tie', function(){

            });
        });

    });

    describe('tie breakers', function(){

        xit('should sort ties by creation timestamp', function(){

        });

    });

    describe('notes', function(){

        xit('should allow all users to take peronsal notes on active topic', function(){

        });

    });
  });
});
