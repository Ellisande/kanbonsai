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
           expect(global.getElementById('participantIsHost').getText()).toBe(' (H)');

        });

        it('should show who the hosts are', function(){
          expect(global.getParticipantElem(0, 'name').getText()).toContain('(H)');

        });

        it('should show a timer', function(){
          expect(meetingPage.timerMinutes().getText()).not.toBeNull();
          expect(meetingPage.timerSeconds().getText()).not.toBeNull();
        });

        xit('should allow the host to start the timer', function(){
          var secondsStart;

          meetingPage.timerSeconds().getText()
            .then(function(seconds){
              seconds0 = seconds;
              expect(seconds0).toBe('00');
              return global.startTimer();
            })
            .then(function(){
              return browser.driver.sleep(5000);
            })
            // .then(function() {
            //   global.stopTimer();
            // })
            .then(function(){
              return meetingPage.timerSeconds().getText();
            })
            .then(function(seconds1) {
              expect(seconds1).not.toBe('00');
            });
        });

        it('should allow the host to reset the timer', function(){

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
           //var mergePage = new po.MergePage();

           it('should allow you to navigate to the merge phase', function() {
             global.goToNextPhase();
             expect(global.getPhaseText()).toMatch(/PHASE: MERGE/);
           });


          it('should allow merging of 2+ topics', function(){

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
                  global.clickElemByButtonText('Edit Topic');
                  expect(global.allSubmitTopics.count()).toEqual(7);

              });

            });

            describe('timer', function(){
                xit('should do nothing', function() {
                });
            });
        });

        describe('voting phase', function(){

            var votingPage = new po.VotingPage();

            it('should allow you to navigate to the voting phase', function() {
              global.goToNextPhase();
              expect(global.getPhaseText()).toMatch(/PHASE: VOTING/);
            });

            it('should display an icon to vote with', function(){
              expect(element(by.repeater('topic in meeting.topics').row(0)).$('.voteUp').getText()).toBe('↑');
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

            xit('should not allow a user to vote 4 or more times', function(){

            });

            xit('should allow the host to manually start the phase timer', function(){

            });

            xit('should show the remaining time for the phase', function(){

            });

            xit('should display total number of remaining votes across all users to the host', function(){

            });

            describe('timer expires', function(){

                xit('should stop at 0:00, but do nothing else', function(){

                });
            });
        });

        describe('discuss phase', function(){

            var discussPage = new po.DiscussPage();

            it('should allow navigation to the discuss phase', function(){
              global.goToNextPhase();
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

    xdescribe('complete', function(){

      xit('should show star guy', function(){

      });

      xit('should prompt for email', function(){

      });

      xit('should move the participants to the landing page', function(){

      });

      xit('should delete the meeting', function(){

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
    })

});
