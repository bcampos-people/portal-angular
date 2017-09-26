(function () {
  'use strict';

  angular
    .module('portalClient')
    .controller('ExpiredSessionController', ExpiredSessionController);

  function ExpiredSessionController($state, AuthService) {
    var vm = this;
    
    vm.goToLogin = function () {
      AuthService.logout();

      $state.go('root.login');
    };

  }
})();