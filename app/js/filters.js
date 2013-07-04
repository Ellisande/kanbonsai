'use strict';

/* Filters */

angular.module('standupFilters', []).filter('checkmark', function() {
  return function(input) {
  	var difference = (new Date(input) - new Date());
  	var minutes = Math.floor(difference / 60000);
  	var seconds = Math.floor(difference % 60000 / 1000);
    return minutes+":"+seconds;
  };
});
