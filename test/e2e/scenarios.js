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
        
        });
        
        it('should show the name of the meeting', function(){
            expect(meetingPage.meetingListText()).toContain(homePage.getMeetingName());
        });
        
        xit('should show who the host is', function(){
            
        });
        
        xit('should show me if I am the host', function(){
            
        });
        
        xit('should allow transition to the next meeting phase', function(){
        
        });
        
        xit('should show a timer', function(){
            
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
                    
            describe('timer expiration', function(){
                
                xit('(maybe?) should advance automatically to the merge phase', function(){
                
                });
                
                xit('(maybe?) should disable submission, but not automaticallly transition to merge phase', function(){
                
                });
            });
        });
        
        describe('merge phase', function(){
            
            xit('(maybe?) should allow merging of 2+ topics', function(){
            
            });
            
            xit('should allow us to merge two topics', function(){
            
            });
            
            describe('merge ownership', function(){
            
                xit('(maybe?) should show all owners for a merged topic', function(){
                
                });
                
                xit('(maybe?) should show the original topic owner', function(){
                
                });
            });
            
            describe('merge text', function(){
            
                xit('(maybe?) should merge text when topics are merged', function(){
            
                });
                
                xit('(maybe?) should show original text when topics are merged', function(){
            
                });
            });
            
            describe('timer expiration', function(){
                
                xit('(maybe?) should advance automatically to the vote phase', function(){
                
                });
                
                xit('(maybe?) should disable merging, but not automaticallly transition to voting phase', function(){
                
                });
            });
        });
        
        describe('voting phase', function(){
            
            xit('should start the timer when the phase begins', function(){
            
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
            
            xit('(maybe?) should display total number of remaining votes across all users', function(){
            
            });
            
            xit('(maybe?) should allow a user to change their votes', function(){
            
            });
            
            describe('timer expiration', function(){
                
                xit('(maybe?) should advance automatically to the discuss phase', function(){
                
                });
                
                xit('(maybe?) should disable voting, but not automatically move to the discuss phase', function(){
                
                });
            });
        });
    
        describe('discuss phase', function(){
            
            xit('should order the topics by number of votes', function(){
                
            });
            
            xit('should show the active topic', function(){
                
            });
            
            xit('should show the remaining time to discuss the active topic', function(){
            
            });
            
            xit('should allow the host to advance to the topic forcibly', function(){
                
            });
            
            describe('all topics discussed', function(){
                xit('(maybe?) should show star guy', function(){
                
                });
                
                xit('(maybe?) should show a summary of topics discussed', function(){
                
                });
                
                xit('should have no active topic', function(){
                
                });
                
                xit('should hide any remaining timers', function(){
                
                });
                
                xit('(maybe?) should prompt for email', function(){
                
                });
                
                xit('(maybe?) should move the user to the landing page and delete the meeting', function(){
                
                });
            });
            
            
            describe('timer expiration', function(){
            
                xit('(maybe?) should allow you to vote to continue discussing this topic', function(){
                
                });
                
                xit('(maybe?) should allow you to vote to continue discussing this topic 15 seconds prior to expiration', function(){
                
                });
                
                describe('vote is to stop talking about the current topic' , function(){
                    
                    xit('(maybe?) automatically move to the next topic', function(){
                
                    });
                    
                    xit('(maybe?) should do nothing', function(){
                
                    });
                    
                    xit('(maybe?) it allows manual movement to the next topic (by host, or by user)', function(){
                
                    }); 
                    
                });
                
                describe('vote is to continue talking' , function(){
                    
                    xit('(maybe?) automatically reset the timer to 3 minutes', function(){
                
                    });
                    
                    xit('(maybe?) should do nothing', function(){
                
                    });
                    
                    xit('(maybe?) it allows manual reset of the timer', function(){
                
                    }); 
                    
                });
                
                describe('the vote to continue is tied or no one votes', function(){
                    xit('(maybe?) host breaks the tie', function(){
                
                    });
                    
                    xit('(maybe?) tie goes stop', function(){
                
                    });
                });
                
            });
            
            
            describe('tie breakers', function(){
                xit('(maybe?) should sort ties by timestamp', function(){
                
                });
                
                xit('(maybe?) should randomize ties', function(){
                
                });
                
                xit('(maybe?) should sort ties alphabetically', function(){
                
                });
            });
            
            describe('(maybe?) notes', function(){
            
                xit('(maybe?> allow host to take notes on active topic', function(){
                
                });
                
                xit('(maybe?) should allow participants to take personal notes', function(){
                
                });
                
                
                xit('(maybe?) should allow collaborative note taking', function(){
                
                });
                
                xit('(maybe?) should display the all notes to all participants', function(){
                
                });
                
                xit('(maybe?) should only allow the Chinese swear words from Firefly', function(){
                
                });
            });
            
            describe('email', function(){
                xit('(maybe?) should allow "subscribing" to each topic', function(){
                
                });
                
                xit('(maybe?) should populate an email subject and body', function(){
                
                });
                
                xit('should be optional', function(){
                
                });
                
                describe('body', function(){
                    xit('(maybe?) should contain all the topics discussed', function(){
                
                    });
                    
                    xit('(maybe?) should contain only the topics "subscribed" to', function(){
                
                    });
                    
                    xit('(maybe?) should contain the notes for each topic', function(){
                
                    });
                });
            });
        });
    });

});
