

/* Filters */

angular.module('filters', []).filter('timer', function(){
    return function(input){
      'use strict';
      return input < 10 ? '0'+input : ''+input;  
    };
});
