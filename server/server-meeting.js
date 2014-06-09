'use strict';
var moment = require('moment');

function Phase(name, next){
    this.name = name;
    this.timer = moment.duration(3, 'minutes');
    this.next = next;
}

module.exports = function ServerMeeting(name) {
    var phases = {
        submit: new Phase('submit', 'merge'),
        merge: new Phase('merge', 'voting'),
        voting: new Phase('voting', 'discuss'),
        discuss: new Phase('discuss', 'complete'),
        complete: new Phase('complete', 'complete')
    };

    var created = moment();

    this.name = name;
    this.participants = [];
    this.topics = [];
    this.phase = phases.submit;

    this.isAbandoned = function() {
      // The default meeting is never abandoned!
      if (this.name === "default") return false;
      return (this.participants.length === 0 && (moment().diff(created, 'hours') > 2));
    };

    this.sortTopics = function(){
      this.topics.sort(function(left, right){
        if(left.voters.length > right.voters.length) return -1;
        return left.voters.length < right.voters.length ?  1 :  0;
      });
    };

    // serialize claimed names as an array
    this.getAllNames = function () {
        return this.participants;
    };

    this.addTopic = function (comment) {
        this.comments.push(comment);
    };

    this.removeTopic = function (comment) {
        delete this.comments[comment];
    };

    this.getAllTopics = function () {
        var res = [];
        this.comments.forEach(function (comment) {
            res.push(comment);
        });

        return res;
    };

    this.getTopic = function(topic){
      var foundTopic;
      topics.some(function(currentTopic){
        if(topic.body == currentTopic.body && topic.author == currentTopic.author){
          foundTopic = currentTopic;
          return true;
        }
      });
    };

    this.getCurrentTopic = function(){
      var currentTopic;
      var hasCurrentTopic = this.topics.some(function(topic){
        if(topic.current == true){
          currentTopic = topic;
          return true;
        }
      });
      return currentTopic;
    };

    this.nextTopic = function(){
        if(this.topics.length <= 0) return;
        this.sortTopics();
        var currentTopic;
        var foundOne = this.topics.some(function(topic, index){
          var previousTopic = this.topics[index - 1] || {};
          if(previousTopic.current){
            previousTopic.current = false;
            topic.current = true;
            currentTopic = topic;
            return true;
          }
        }, this);

        if(!foundOne) {
          var first = this.topics[0];
          var last = this.topics.slice(-1)[0];
          first.current = true;
          currentTopic = first;
          if(first != last) last.current = false;
        }

        return currentTopic;
    };

    this.nextPhase = function(){
        this.phase = phases[this.phase.next];
        return this.phase;
    };

    this.getRegularTimer = function(){
      return this.phase.timer;
    };

    this.getDiscussPhaseTimer = function(meeting){
      var currentTopic = this.getCurrentTopic();
      if(!currentTopic) return moment.duration(0, 'seconds');
      return currentTopic.timer;
    };

    this.getTimer = function(){
      var timer;
      if(this.phase == phases.discuss) {
        timer = this.getDiscussPhaseTimer();
      } else {
        timer = this.getRegularTimer();
      }

      // All this saftey checking is a workaround until we figure out why
      // this method sometimes returns a non-duration object.
      // if (!timer || typeof timer.asMilliseconds != 'function') {
      //   timer = moment.duration(0, 'seconds');
      // }

      return timer;
    };
};
