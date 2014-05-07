beforeEach(function () {
  jasmine.addMatchers({
    toBePlaying: function () {
      return {
        compare: function (actual, expected) {
          var player = actual;

          return {
            pass: player.currentlyPlayingSong === expected && player.isPlaying
          }
        }
      };
    }
  });
});

//  function cssMatcher(presentClasses, absentClasses) {
//    return function() {
//      var element = angular.element(this.actual);
//      var present = true;
//      var absent = false;
//
//      angular.forEach(presentClasses.split(' '), function(className){
//        present = present && element.hasClass(className);
//      });
//
//      angular.forEach(absentClasses.split(' '), function(className){
//        absent = absent || element.hasClass(className);
//      });
//
//      this.message = function() {
//        return "Expected to have " + presentClasses +
//          (absentClasses ? (" and not have " + absentClasses + "" ) : "") +
//          " but had " + element[0].className + ".";
//      };
//      return present && !absent;
//    };
//  }

