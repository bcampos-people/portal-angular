(function () {
  'use strict';

  angular
    .module('portalClient')
    .filter('cpf', function () {
      return function (input) {
        var formatter = new StringMask('000.000.000-00');
        return formatter.apply(input);
      };
    });

})();
