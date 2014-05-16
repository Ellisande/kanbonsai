var po = require('./page-objects');
var ptor = protractor.getInstance();

describe('lean coffee', function() {
  var global = new po.GlobalFunction();

  describe('complete', function(){
    var completePhase = new po.CompletePage();
    xit('should show star guy', function(){

    });


    xit('should move the participants to the landing page', function(){

    });

    xit('should delete the meeting', function(){

    });

    describe('email', function(){
        it('should allow you to navigate to the complete phase', function() {
          completePhase.bypassEarlierPages();
          expect(global.getPhaseText()).toMatch(/PHASE: COMPLETE/);
        });

        it('should disable send button if email input text empty', function(){
           expect(global.getElemByButtonText('Send').isDisplayed()).toEqual(true);
           expect(global.getElemByButtonText('Send').isEnabled()).toBe(false);
        });

        it('should enable send button if email input text not empty', function(){
           global.getElemByModel('email.to').sendKeys("test@sf.com");
           expect(global.getElemByButtonText('Send').isDisplayed()).toEqual(true);
           expect(global.getElemByButtonText('Send').isEnabled()).toBe(true);
        });

        xit('should be optional', function(){

        });

        xdescribe('body', function(){
            it('should contain all the topics discussed', function(){
             expect(global.allSubmitTopics.count()).toEqual(7);
            });

            xit('should contain the notes for each topic', function(){

            });
        });
    });
  });

});
