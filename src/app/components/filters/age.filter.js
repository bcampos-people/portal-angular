(function () {
  'use strict';

  angular
    .module('portalClient')
    .filter('ageFilter', function () {

      function calculateAge(birthday) {
        if (birthday != undefined) {
          var ageDifMs = (Date.now() - birthday);
          var ageDate = new Date(ageDifMs); // miliseconds from epoch
          return Math.abs(ageDate.getUTCFullYear() - 1970);
        }
      }

      return function (birthdate) {
        return calculateAge(birthdate);
      };

    });
})();
