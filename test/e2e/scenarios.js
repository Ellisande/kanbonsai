var po = require('./page-objects');
var ptor = protractor.getInstance();
describe('lean coffee', function(){

    var global   = new po.GlobalFunction();
    var topics = [];
    describe('meeting', function(){
      var homePage = new po.HomePage();


      homePage.get();
      homePage.createMeeting(); // TODO: expect meeting page

        var meetingPage = new po.MeetingPage();

        it('should display my user name', function() {
            expect(meetingPage.userGreeting().getText()).toMatch(/You are: [\s\w]+/);
        });

        it('should display the meeting particpants', function(){
          expect(global.allparticipants.count()).toEqual(1);
        });

        it('should show the name of the meeting', function(){
            expect(meetingPage.meetingListText()).toContain(homePage.getMeetingName());
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

        })

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
           expect(global.getElementById('participantIsHost').getText()).toBe('(H)');

        });

        it('should show who the hosts are', function(){
          expect(global.getParticipantElem(0, 'name').getText()).toContain('(H)');

        });

        it('should show a timer', function(){
          expect(meetingPage.timerMinutes().getText()).not.toBeNull();
          expect(meetingPage.timerSeconds().getText()).not.toBeNull();
        });

        xit('should allow the host to start the timer', function(){

        });

        xit('should allow the host to reset the timer', function(){

        });


          describe('sumbit phase', function() {
           var author='';
                it('should allow us submit a topic', function() {
                    meetingPage.userGreeting().getText().then(function(userGreeting) {
                      author = userGreeting.substring(9);
                    });
                      var allTopics;
                      for(var k=1; k< 10;k++){
                        topics.push(meetingPage.postTopic());
                      }
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
               });
    });

        describe('merge phase', function(){
           var mergePage = new po.MergePage();

          it('should allow merging of 2+ topics', function(){
           mergePage.goToMergePhase();
            expect(global.allSubmitTopics.count()).toEqual(9);
             expect(global.getTopicElem(0,'body').getText()).toEqual(topics[0]);
             global.clickElemById("mergeCheckBoxes0");
             global.clickElemById("mergeCheckBoxes1");

            expect(global.getElementByModel('newMergeText.value').getAttribute('value')).toEqual(topics[0]+'\n'+topics[1]);
             global.clickElemByButtonText('Merge Topics');
            expect(global.allSubmitTopics.count()).toEqual(8);

          });

           describe('merge ownership', function(){

            it('should show a list of owners for a merged topic', function(){
               expect(global.getTopicElem(0, 'author').getText()).toMatch(/[\s\w]+/);
            });
           });

            describe('merge text', function(){

              it('should merge text when topics are merged', function(){
                 global.clickElemById("mergeCheckBoxes1");
                 global.clickElemById("mergeCheckBoxes7");
                expect(global.getElementByModel('newMergeText.value').getAttribute('value')).toEqual(topics[3]+'\n'+topics[0]+'\n'+topics[1]);
                 global.clickElemByButtonText('Merge Topics');
                expect(global.allSubmitTopics.count()).toEqual(7);

              });

              it('should allow editing of the merged text', function(){
                  global.clickElemById("mergeCheckBoxes2");
                  var newMergeText=global.getElementByModel('newMergeText.value');
                  newMergeText.clear();
                  newMergeText.sendKeys('New Text Added');
                  expect(global.getElementByModel('newMergeText.value').getAttribute('value')).toEqual('New Text Added');
                  expect(global.allSubmitTopics.count()).toEqual(7);

              });

            });

            describe('timer', function(){
                xit('should do nothing', function() {
                });
            });
        });

        describe('voting phase', function(){

            xit('should allow the host to manually start the phase timer', function(){

            });

            xit('should show the remaining time for the phase', function(){

            });

            xit('should display an icon to vote with', function(){

            });

            xit('should allow a user to vote', function(){

            });

            xit('should allow a user to vote up to 3 times', function(){

            });

            xit('should allow a user to vote on up to 3 topics', function(){

            });

            xit('should allow a user to vote 3 times on a single topic', function(){

            });

            xit('should not allow a user to vote 4 or more times', function(){

            });

            xit('should display the number of votes the user has remaining', function(){

            });

            xit('should display total number of remaining votes across all users to the host', function(){

            });

            xit('should allow a user to change their votes', function(){

            });

            describe('timer expires', function(){

                xit('should stop at 0:00, but do nothing else', function(){

                });
            });
        });

        describe('discuss phase', function(){

            xit('should allow the host to end the meeting', function(){

            });

            xit('should order the topics by number of votes', function(){

            });

            xit('should show the active topic', function(){

            });

            xit('should show the remaining time to discuss the active topic', function(){

            });

            xit('should allow the host to advance to the topic forcibly', function(){

            });

            describe('all topics discussed', function(){
                xit('should show star guy', function(){

                });

                xit('should have no active topic', function(){

                });

                xit('should hide any remaining timers', function(){

                });

                xit('should prompt for email', function(){

                });

                xit('should move the participants to the landing page', function(){

                });

                xit('should delete the meeting', function(){

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

            describe('email', function(){

                xit('should populate an email subject and body', function(){

                });

                xit('should be optional', function(){

                });

                describe('body', function(){
                    xit('should contain all the topics discussed', function(){

                    });

                    xit('should contain the notes for each topic', function(){

                    });
                });
            });

    });

});
