var po = require('./page-objects');

describe('lean coffee', function(){

    var homePage = new po.HomePage();
    homePage.get();
    homePage.createMeeting(); // TODO: expect meeting page

    describe('meeting', function(){
        var meetingPage = new po.MeetingPage();

        it('should display my user name', function(){
            expect(meetingPage.userGreeting().getText()).toMatch(/You are: [\s\w]+/);
        });

        xit('should display the meeting particpants', function(){
          it('should do stuff', function(){
            return 'and then do other things';
          })
        });

        it('should show the name of the meeting', function(){
            expect(meetingPage.meetingListText()).toContain(homePage.getMeetingName());
        });

        xit('should show who the hosts are', function(){

        });

        xit('should show me if I am the host', function(){

        });

        xit('should allow a user to become a host', function(){

        })

        xit('should allow the host to transition to the next phase', function(){

        });

        xit('should show a timer', function(){

        });

        xit('should allow the host to start the timer', function(){

        });

        xit('should allow the host to reset the timer', function(){

        });

        describe('sumbit phase', function(){

            xit('should allow us submit a topic', function(){

            });

            xit('should show all topics', function(){

            });

            xit('should show the remaining time for the phase', function(){
            x
            });

            xit('should show the name of the person who submitted the topic', function(){

            });

            describe('timer expires', function(){

                xit('should stop the timer at 0:00, and do nothing else', function(){

                });
            });
        });

        describe('merge phase', function(){

            xit('should allow merging of 2+ topics', function(){

            });

            xit('should allow us to merge two topics', function(){

            });

            describe('merge ownership', function(){

                xit('(maybe?) should show a list of owners for a merged topic', function(){

                });
            });

            describe('merge text', function(){

                xit('should merge text when topics are merged', function(){

                });

                xit('should allow editing of the merged text', function(){

                });

            });

            describe('timer', function(){
                xit('should do nothing', function(){

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

});
