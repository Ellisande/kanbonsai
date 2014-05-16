'use strict';
var moment = require('moment');

function Phase(name, next){
    this.name = name;
    this.time = moment.duration(3, 'minutes');
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
    this.name = name;
    this.participants = [];
    this.topics = [];
    this.phase = phases.submit;
    this.startTime = moment(new Date()).add('minutes', 15);
    this.timer = {
        endTime: 0,
        isStarted: function(){
            var now = moment();
            var endTime = moment(endTime);
            return now.isAfter(endTime);
        }
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
    }

    this.getCurrentTopic = function(){
      var currentTopic;
      var hasCurrentTopic = this.topics.some(function(topic){
        if(topic.current == true){
          currentTopic = topic;
          return true;
        }
      });
      return currentTopic;
    }

    this.nextTopic = function(){
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
};
