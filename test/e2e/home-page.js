var po = require('./page-objects');
var ptor = protractor.getInstance();

describe('lean coffee', function() {
  var global = new po.GlobalFunction();

  describe('home page', function(){
    var homePage = new po.HomePage();

    it('should display the home page', function() {
      homePage.get();
      expect($('.welcome').getText()).toBe('Welcome to Kanbonsai!');
      expect(ptor.getCurrentUrl()).toContain('#/home');
    });

    it('should allow user to enter a meeting name', function() {
      expect(element(by.model('meetingName')).getAttribute('value')).toBe('');
      homePage.setMeetingNameInput('Testing Meeting Name');
      expect(element(by.model('meetingName')).getAttribute('value')).toBe('Testing Meeting Name');
      homePage.setMeetingNameInput('');
    });

    it('should display a Create a Meeting! button', function() {
      expect(element(by.buttonText('Create a Meeting!')).isPresent()).toBe(true);
    });

    it('should navigate to submit phase when user clicks Create a Meeting! button', function() {
      homePage.createMeeting();
      expect(global.getPhaseText()).toMatch(/PHASE: SUBMIT/);
      expect(ptor.getCurrentUrl()).toContain('#/meeting');
    });
  });
});
