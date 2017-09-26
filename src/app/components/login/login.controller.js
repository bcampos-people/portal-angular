(function () {
  'use strict';

  angular
    .module('portalClient')
    .controller('LoginController', LoginController);

  function LoginController($scope, $location, $state, $filter, $stateParams, $log, $window, $sce, LocalStorage, patientService, practitionerService, AuthService, ApplicationProperties, jwtHelper) {

    var vm = this;
    vm.username = '';
    vm.password = '';
    vm.type = '';

    vm.showAll = true;
    vm.showLogin = false;

    vm.showError = false;
    vm.errorMsg = '';

    vm.loading = false;

    //Se houver sessão ativa, pula a tela de login
    var credential = LocalStorage.getObject(ApplicationProperties.CREDENTIAL);
    if ((credential !== 'undefined') && (credential !== null)) {
      var token = LocalStorage.get(ApplicationProperties.TOKEN_NAME);
      if ((token !== 'undefined') && (token !== null)) {
        var isTokenExpired = jwtHelper.isTokenExpired(token);
        if (!isTokenExpired) {
          //renova a sessão ao logar automaticamente  
          AuthService.renewSession(token).then(function (data) {
            if (data) {
              LocalStorage.put(ApplicationProperties.TOKEN_NAME, data.token);
            }
          }).catch(function (err) {
            $log.info(err.message);
          });

          if (credential.type == ApplicationProperties.TYPE_PRACTITIONER) {
            $state.go('root.practitioner_list_patient');
          } else if (credential.type == ApplicationProperties.TYPE_PATIENT) {
            $state.go('root.exame');
          }
        }
      }
    }

    vm.doLogin = function () {
      vm.showError = false;
      vm.loading = true;

      AuthService.login({
        username: vm.username,
        password: vm.password,
        type: vm.type
      }).then(function (data) {

        var user = data;
        if (user != null) {
          vm.loading = false;
          if (user.type === ApplicationProperties.TYPE_PATIENT) {
            $state.go('root.exame');
          } else if (user.type === ApplicationProperties.TYPE_PRACTITIONER) {
            $state.go('root.practitioner_list_patient');
          } else {
            $log.error('Tipo inválido >>> ' + user.type);
          }
        }

      }).catch(function (err) {
        vm.showError = true;
        vm.loading = false;
        vm.password = '';

        if (err.status === 500) {
          vm.errorMsg = 'Não foi possível processar a sua solicitação. Aguarde uns minutos e tente novamente.';
        } else {
          vm.errorMsg = 'Usuário e/ou senha incorreto(s).'
        }

        AuthService.logout();
      });
    };

    vm.typePatient = function () {
      vm.type = ApplicationProperties.TYPE_PATIENT;
      vm.showAll = false;
      vm.showLogin = true;

      LocalStorage.put(ApplicationProperties.USER_TYPE, vm.type);
    }

    vm.typePractitioner = function () {
      vm.type = ApplicationProperties.TYPE_PRACTITIONER;
      vm.showAll = false;
      vm.showLogin = true;

      LocalStorage.put(ApplicationProperties.USER_TYPE, vm.type);
    }

    vm.cancel = function () {
      vm.username = '';
      vm.password = '';
      vm.type = null;
      vm.showAll = true;
      vm.showLogin = false;
      vm.showError = false;
    }

  }
})();
