'use strict';

module.exports = function ServerMeeting(name) {
    var moment = require('moment');
    this.name = name;
    this.userIds = 1;
    this.commentIds = 1;
    this.participants = [];
    this.comments = [];
    this.startTime = moment(new Date()).add('minutes', 15);

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