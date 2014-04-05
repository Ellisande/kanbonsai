'use strict';

/* Filters */

angular.module('filters', []).filter('timer', function(){
    return function(input){
      return input < 10 ? '0'+input : ''+input;  
    };
});
