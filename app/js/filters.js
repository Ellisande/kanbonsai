'use strict';

/* Filters */

angular.module('standupFilters', []).filter('timeTillStart', function() {
  return function(input) {
  	var timeTillStart = moment(input).fromNow();
    return timeTillStart;
  };
}).filter('hideOnTrue', function(){
	return function(input){
		return input ? 'hidden' : '';
	};
}).filter('timer', function(){
    return function(input){
      return input < 10 ? '0'+input : ''+input;  
    };
});
