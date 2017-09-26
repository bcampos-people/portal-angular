(function () {
  'use strict';

  angular
    .module('portalClient')
    .filter('initialsName', function () {

      function initialsName(name) {
        if (name != undefined) {
          var inls = name.match(/\b\w/g) || [];
          inls = ((inls.shift() || '') + (inls.pop() || '')).toUpperCase();
          return inls;
        }
      }

      return function (name) {
        return initialsName(name);
      };

    });
})();
