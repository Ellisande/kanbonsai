var po = require('./page-objects');
var ptor = protractor.getInstance();

describe('lean coffee', function() {
  var global = new po.GlobalFunction();

  describe('timer edit action', function(){
    var timerEditPage = new po.TimerEditPage();

    it('should display my user name', function() {
      timerEditPage.bypassEarlierPages();
      expect(timerEditPage.userGreeting().getText()).toMatch(/You are: [\s\w]+/);
    });
    
    it('should become the host', function(){
        var becomeHost = global.getElementById('hostToggleOff');
        var backToNormalUser = global.getElementById('hostToggleOn');

        expect(becomeHost.isDisplayed()).toEqual(true);
        expect(backToNormalUser.isDisplayed()).toEqual(false);

        becomeHost.click();

        expect(becomeHost.isDisplayed()).toEqual(false);
        expect(backToNormalUser.isDisplayed()).toEqual(true);
    });
    
     it('should allow a user to click edit timer', function(){
         var editTimer = global.getElementById('editTimer');
         
        expect(editTimer.isDisplayed()).toEqual(true);
    
        editTimer.click();
        var setTimer = global.getElementById('setTimer');
         
        expect(editTimer.isDisplayed()).toEqual(true);
        expect(setTimer.isDisplayed()).toEqual(true);

        editTimer.click();
    });
      
    it('should allow a user to edit timer minutes', function(){
        var editTimer = global.getElementById('editTimer');
    
        editTimer.click();
        
        timerEditPage.setEditTimer(2);
        expect(timerEditPage.timerMinutes().getText()).not.toBeNull();
        expect(timerEditPage.timerMinutes().getText()).toEqual('02 :');
    });
     
    it('should carry updated time forward to next phase', function(){
        timerEditPage.buildTwoTopics();
        timerEditPage.goToVotePhase();
        
        expect(timerEditPage.timerMinutes().getText()).not.toBeNull();
        expect(timerEditPage.timerMinutes().getText()).toEqual('02 :');
    }); 
    
    it('should carry updated time forward to topics', function(){
        timerEditPage.goToDiscussPhaseFromVotePhase();
        
        var topics = timerEditPage.getTopics();
        topics.get(0).getAttribute('class').then(function(classes){
            expect(classes).toContain('current');
        });
        
        expect(timerEditPage.timerMinutes().getText()).not.toBeNull();
        expect(timerEditPage.timerMinutes().getText()).toEqual('02 :');
    }); 
      
  });
});