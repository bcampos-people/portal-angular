(function () {
  'use strict';

  angular
    .module('portalClient')
    .controller('PatientPerfilController', PatientPerfilController);

  function PatientPerfilController(patientService, LocalStorage, AuthService, $state, $log, ApplicationProperties) {

    var vm = this;

    vm.data = {};

    if (LocalStorage.get('CREDENTIAL')) {
      vm.credential = LocalStorage.getObject('CREDENTIAL');

      if (vm.credential != null) {
        vm.loading = true;
        patientService.getPatientById().query({ idPatient: vm.credential.id },
          function (result) {
            result.$promise.then(function (data) {
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
        "type": ApplicationProperties.TYPE_PATIENT
      }).then(function (data) {
        $state.go('root.password_reset', {"token": data.token});
      }).catch(function () {
        vm.errorMsg = 'Servidor indisponível. Aguarde uns minutos e tente novamente.';
      });
    }

  }
})();
