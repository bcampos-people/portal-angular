
(function () {
  'use strict';

  angular
    .module('portalClient')
    .controller('LoginEmailRememberController', LoginEmailRememberController);

  function LoginEmailRememberController(AuthService, ApplicationProperties, LocalStorage) {

    var vm = this;

    vm.loading = false;

    vm.email = '';
    vm.birthDate = null;

    vm.maxDate = new Date();

    vm.sendMode = true;
    vm.sendModeLogin = false;
    vm.showError = false;
    vm.showSuccess = false;
    
    vm.errorMsg = '';

    vm.type = LocalStorage.get(ApplicationProperties.USER_TYPE);

    vm.sendEmail = function () {
      vm.loading = true;
      AuthService.passwordRemember({
        "email": vm.email,
        "username": vm.username,
        "type": vm.type
      }).then(function () {

        vm.sendMode = false;
        vm.showSuccess = true;
        vm.loading = false;

      }).catch(function (error) {
        vm.showError = true;
        vm.sendMode = false;
        vm.showSuccess = false;
        vm.loading = false;

        if (error.status == '500') {
          vm.errorMsg = 'Não foi possível processar a sua solicitação. Aguarde uns minutos e tente novamente.';
        } else {
          vm.errorMsg = error.message;
        }
      });

    }

    vm.clear = function () {
      //vm.email = '';

      vm.sendMode = true;

      vm.showError = false;
      vm.errorMsg = '';
      vm.showSuccess = false;
    }

    vm.rememberLogin =function() {
      vm.sendMode = false;
      vm.sendModeLogin = true;
      vm.showError = false;
      vm.errorMsg = '';
      vm.showSuccess = false;
    }

    vm.sendLoginEmail = function () {
      vm.loading = true;
      
      var date = null;
      if (vm.birthDate) {
        date = moment(vm.birthDate).format('DD/MM/YYYY');
      }

      AuthService.usernameRemember({
        "email": vm.email,
        "birthDate": date,
        "type": vm.type
      }).then(function () {

        vm.sendModeLogin = false;
        vm.showSuccess = true;
        vm.loading = false;

      }).catch(function (error) {
        vm.showError = true;
        vm.sendMode = false;
        vm.showSuccess = false;
        vm.sendModeLogin = false;
        vm.loading = false;

        if (error.status == '500') {
          vm.errorMsg = 'Não foi possível processar a sua solicitação. Aguarde uns minutos e tente novamente.';
        } else {
          vm.errorMsg = error.message;
        }

      });
    }

  }
})();