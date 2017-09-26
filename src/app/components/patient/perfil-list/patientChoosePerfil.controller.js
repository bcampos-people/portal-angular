(function () {
  'use strict';

  angular
    .module('portalClient')
    .controller('PatientChoosePerfilController', PatientChoosePerfilController);

  function PatientChoosePerfilController($state, LocalStorage) {

    var vm = this;

    vm.choosePerfil = function (perfilId) {
      LocalStorage.putObject('PERFIL_ID', perfilId);
      LocalStorage.put('PATIENT_SELECTED', perfilId);

      $state.go('root.exame');
    }

  }

})();