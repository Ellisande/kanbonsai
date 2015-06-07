'use strict';
var moment = require('moment');

function Timekeeper(minutes){
    this.amount = moment.duration(minutes, 'minutes');
    
    this.modify = function(minutes){
      this.amount = moment.duration(minutes, 'minutes');
    };
}

module.exports = {
    Timekeeper: Timekeeper
}