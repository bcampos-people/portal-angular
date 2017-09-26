(function () {
  'use strict';

  angular
    .module('portalClient')
    .controller('PractitionerPerfilController', PractitionerPerfilController);

  function PractitionerPerfilController(practitionerService, LocalStorage, $state, AuthService, ApplicationProperties) {

    var vm = this;

    vm.loading = true;
    vm.data = {};

    if (LocalStorage.get('CREDENTIAL')) {
      vm.credential = LocalStorage.getObject('CREDENTIAL');

      if (vm.credential != null) {
        vm.loading = true;
        practitionerService.getPractitioner().get({ idPractitioner: vm.credential.id },
          function (result) {
            result.$promise.then(function (data) {
              vm.loading = false;

              vm.data = data;

              vm.loading = false;
            }, function () { });
          }, function () {
            vm.loading = false;
            vm.error = true;
            vm.errorMessage = 'Ocorreu em erro';
            vm.loading = false;            
          });
      }
    }

    vm.goToPasswordReset = function () {
      AuthService.generateResetPasswordToken({
        "username": vm.data.username,
        "idFhir": vm.data.id,
        "type": ApplicationProperties.TYPE_PRACTITIONER
      }).then(function (data) {
        $state.go('root.password_reset', {"token": data.token});
      }).catch(function () {
        vm.errorMsg = 'Servidor indisponível. Aguarde uns minutos e tente novamente.';
      });
    }

  }
})();
