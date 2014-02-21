'use strict';

module.exports = function ServerMeeting(name) {
    var moment = require('moment');
    this.name = name;
    this.participants = [];
    this.comments = [];
    this.startTime = moment(new Date()).add('minutes', 15);
    this.timer = {
        endTime: 0,
        isStarted: function(){
            var now = moment();
            var endTime = moment(endTime);
            return now.isAfter(endTime);
        }
    };

    // serialize claimed names as an array
    this.getAllNames = function () {
        return this.participants;
    };

    this.addComment = function (comment) {
        this.comments.push(comment);
    };

    this.removeComment = function (comment) {
        delete this.comments[comment];
    };

    this.getAllComments = function () {
        var res = [];
        this.comments.forEach(function (comment) { 
            res.push(comment); 
        });

        return res;
    };
};