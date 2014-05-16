var po = require('./page-objects');
var ptor = protractor.getInstance();

describe('lean coffee', function() {
  var global = new po.GlobalFunction();

  describe('complete', function(){
    var completePhase = new po.CompletePage();

      it('should allow you to navigate to the complete phase', function() {
        completePhase.bypassEarlierPages();
        expect(global.getPhaseText()).toMatch(/PHASE: COMPLETE/);
      });

    describe('email', function(){

        it('should disable send button if email input text empty', function(){
           expect(global.getElemByButtonText('Send').isDisplayed()).toEqual(true);
           expect(global.getElemByButtonText('Send').isEnabled()).toBe(false);
        });

        it('should enable send button if email input text not empty', function(){
           global.getElemByModel('email.to').sendKeys("test@sf.com");
           expect(global.getElemByButtonText('Send').isDisplayed()).toEqual(true);
           expect(global.getElemByButtonText('Send').isEnabled()).toBe(true);
        });


        it('should be optional', function(){
            expect(global.getElementById('exitMeeting').isDisplayed()).toEqual(true);
            expect(global.getElementById('exitMeeting').isEnabled()).toBe(true);
        });


        describe('body', function(){
            xit('should contain all the topics discussed', function(){
             expect(global.allSubmitTopics.count()).toEqual(7);
            });

            xit('should contain the notes for each topic', function(){

            });

        it('should move the participants to the landing page', function(){
          expect(global.clickElemById('exitMeeting'));
          ptor.waitForAngular();
          expect(ptor.getCurrentUrl()).toContain('#/home');
        });

        xit('should delete the meeting', function(){

        });

        xit('should show star guy', function(){

        });

        });
    });
  });

});
