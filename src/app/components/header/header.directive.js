(function () {
  'use strict';

  angular
    .module('portalClient')
    .directive('customizedHeader', HeaderController);

  /** @ngInject */
  function HeaderController(ApplicationProperties) {
    var directive = {
      restrict: 'E',
      templateUrl: 'app/components/header/header.html',
      scope: {
        creationDate: '='
      },
      controller: HeaderController,
      controllerAs: 'headerController',
      bindToController: true
    };

    return directive;

    /** @ngInject */
    function HeaderController($scope, $state, $location, LocalStorage, AuthService) {

      var vm = this;

      vm.logout = function () {
        AuthService.logout();
      };

      if (LocalStorage.get(ApplicationProperties.CREDENTIAL)) {
        vm.credential = LocalStorage.getObject(ApplicationProperties.CREDENTIAL);
      } else {
        vm.logout();
      }

      vm.goPerfil = function () {
        if (vm.credential.type == ApplicationProperties.TYPE_PATIENT) {
          $state.go('root.patient-perfil');
        } else {
          $state.go('root.practitioner_perfil');
        }
      };

      vm.goHome = function () {
        if (vm.credential.type == ApplicationProperties.TYPE_PATIENT) {
          $state.go('root.exame');
        } else {
          $state.go('root.practitioner_list_patient');
        }
      };

      vm.hasChangePerfil = function () {
        //TODO Demo - Diferenciar pagina de selecao (nao exibir)

        //TODO Demo - Inserir inteligencia
        /*if (vm.credential.type == ApplicationProperties.TYPE_PATIENT) {
          return true;
        } else {
          return false;
        }*/
        return false;
      };

      vm.goExame = function () {
        $state.go('exame');
      };

    }
  }

})();
