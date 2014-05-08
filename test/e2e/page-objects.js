var random = function (min, max) {
    return Math.floor(Math.random()*(max-min+1)+min);
}

module.exports.HomePage = function() {
    this.meetingName = 'test' + random(1000,2000);
    
    this.meetingInput = element(by.model('meetingName')),
    this.createMeetingButton = element(by.buttonText('Create a Meeting!')),
    
    this.get = function() {
        browser.get('http://localhost:5000/'); 
    }
    
    this.createMeeting = function() {
        this.meetingInput.sendKeys(this.meetingName);
        this.createMeetingButton.click();
    }
    
    this.getMeetingName = function() {
        return this.meetingName;
    }
};

module.exports.MeetingPage = function() {
    this.userGreeting = function() {
        return element(by.binding('user'));
    }
    
    this.meetingListText = function() {
        return $('.meeting-list').getText();
    }
};
