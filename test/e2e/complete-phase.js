var po = require('./page-objects');
var ptor = protractor.getInstance();

describe('lean coffee', function() {
  var global = new po.GlobalFunction();

  describe('complete', function(){

    var completePhase = new po.CompletePage();
    var homePage = new po.HomePage();


      it('should allow you to navigate to the complete phase', function() {
        completePhase.bypassEarlierPages();
        expect(global.getElemByButtonText('Send').isDisplayed()).toEqual(true);
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
            it('should contain all the topics discussed', function(){
             expect(completePhase.getAllTopicsCount()).toBe(9);
            });

            it('should contain the notes for each topic', function(){
             expect(completePhase.getFirstNotes()).toBe("These are notes");
            });

            it('should move users to home when they click exit meeting', function(){
              expect(global.clickElemById('exitMeeting'));
              ptor.waitForAngular();
              expect(ptor.getCurrentUrl()).toContain('#/home');
            });

            describe('delete button', function(){

              it('should move the user to the home screen', function(){
                completePhase.bypassEarlierPages();
                expect(global.clickElemById('deleteMeeting'));
                ptor.waitForAngular();
                expect(ptor.getCurrentUrl()).toContain('#/home');
              });

              it('should delete the current meeting', function(){
                console.log(completePhase.getAllMeetings());

              });
            });

        });
    });
  });

});
