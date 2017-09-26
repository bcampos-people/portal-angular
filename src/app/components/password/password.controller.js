(function () {
  'use strict';

  angular
    .module('portalClient')
    .controller('PasswordController', PasswordController);

  function PasswordController($log, $location, AuthService, $stateParams, EulaService,
    ApplicationProperties, moment, UserService, $state) {

    var vm = this;

    vm.loading = false;

    vm.modeError = false;
    vm.modeForm = false;
    vm.modeSuccess = false;

    vm.resetType = null;

    vm.username = '';
    vm.birthDate = '';
    vm.oldPassword = '';
    vm.new = '';
    vm.confirm = '';

    vm.errorMsg = '';

    vm.eula = false;
    vm.eulaText = 'TODO';

    vm.showErrorOldPassword = false;
    vm.showErrorNewPassword = false;
    vm.showErrorConfirmPassword = false;

    var showForm = function () {
      vm.modeError = false;
      vm.modeForm = true;
      vm.modeSuccess = false;
    };

    var showError = function (msg) {
      vm.errorMsg = msg;
      vm.modeError = true;
      vm.modeForm = false;
      vm.modeSuccess = false;
    };

    var showSucess = function (msg) {
      vm.successMsg = msg;
      vm.modeError = false;
      vm.modeForm = false;
      vm.modeSuccess = true;
    };

    /** 
     * Valida o token recebido na URL e define o modo de alteração de senha [CREATE, RESET , REMEMBER]
     */
    vm.token = $stateParams.token;
    if (vm.token == undefined || vm.token == null || (vm.token.length == 0)) {
      showError('Este link não está mais ativo. Você pode solicitar uma nova senha.');
    } else {

      AuthService.validateToken(
        vm.token
      ).then(function (data) {

        vm.resetType = data.actionType;
        vm.idFhir = data.idFhir;
        vm.type = data.type;
        vm.username = data.username;

        showForm();

        if (vm.resetType == 'CREATE') {

          if (vm.type == ApplicationProperties.TYPE_PATIENT) {
            //carrega o termo de uso de primeiro acesso do paciente
            EulaService.getEulaFirstAccessPatient().then(function (data) {
              vm.eulaText = data.text;
            }).catch(function (status) {

              if (status == '500') {
                showError('Servidor indisponível');
              } else {
                showError('Erro ao carregar o Termo de Uso do Portal.');
              }
            });
          } else if (vm.type == ApplicationProperties.TYPE_PRACTITIONER) {
            //carrega o termo de uso de primeiro acesso do medico
            EulaService.getEulaFirstAccessPractitioner().then(function (data) {
              vm.eulaText = data.text;
            }).catch(function (status) {

              if (status == '500') {
                showError('Servidor indisponível');
              } else {
                showError('Erro ao carregar o Termo de Uso do Portal.');
              }
            });
          }
        }
      }).catch(function (status) {
        if (status == '500') {
          showError('Servidor indisponível');
        } else {
          showError('Este link não está mais ativo.');
        }
      });
    }

    vm.validateFields = function () {
      if (vm.resetType == 'CREATE') {
      
        if (!vm.isFieldValid(vm.username)) {
          vm.showErrorUsername = true;
          return false;
        }
        
        if (!vm.isFieldValid(vm.birthDate)) {
          vm.showErrorBirthDate = true;
          return false;
        }

        if (!vm.isFieldValid(vm.new)) {
          vm.showErrorNewPassword = true;
          return false;
        }

        if (!vm.isFieldValid(vm.confirm)) {
          vm.showErrorConfirmPassword = true;
          return false;
        }
        

      } else if (vm.resetType == 'RESET') {
      
        if (!vm.isFieldValid(vm.oldPassword)) {
          vm.showErrorOldPassword = true;
          return false;
        }

        if (!vm.isFieldValid(vm.new)) {
          vm.showErrorNewPassword = true;
          return false;
        }

        if (!vm.isFieldValid(vm.confirm)) {
          vm.showErrorConfirmPassword = true;
          return false;
        }
      }
      
      return true;
    }

    vm.isFieldValid = function(value) {
      return ((value != null) && (value != 'undefined') && (value != ''));
    }

    /**
     * Requisita a redefinição da senha do usuário
     */
    vm.submit = function (form) {
      //if (form.$valid) {
        if (!vm.validateFields()) {
          return;
        }
        
        vm.loading = true;

        if (vm.resetType != 'CREATE') {
          var date = null;
          if (vm.birthDate) {
            date = moment(vm.birthDate).format('DD/MM/YYYY');
          }

          AuthService.resetPassword({
            username: vm.username,
            password: vm.confirm,
            birthDate: date,
            type: vm.type,
            idFhir: vm.idFhir,
            token: vm.token,
            oldPassword: vm.oldPassword
          }).then(function () {
            showSucess('Senha alterada com sucesso.');
            vm.loading = false;
          }).catch(function (data) {
            if (data.status == '500') {
              showError('Náo foi possível processar sua solicitação. Tente novamente.');
            } else if (data.status == '422') {
              showError(data.message);
            } else if (data.status == '409') {
              showError('Não é possível cadastrar esse login. Tente novamente com outro login.');
            } else {
              showError('Erro ao redefinir sua senha.');
            }
            vm.loading = false;
          });
        } else {

          var date = moment(vm.birthDate).format('DD/MM/YYYY');

          AuthService.signup({
            username: vm.username.trim(),
            password: vm.confirm,
            birthDate: date,
            type: vm.type,
            idFhir: vm.idFhir,
            token: vm.token
          }).then(function () {

            AuthService.login({
              username: vm.username,
              password: vm.confirm,
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
              if (err.status == '500') {
                showError('Servidor indisponível');
              } else {
                showError(err.message);
              }
              vm.loading = false;
            });

            vm.loading = false;
          }).catch(function (data) {
            if (data.status == '500') {
              showError('Servidor indisponível');
            } else {
              showError(data.message);
            }
            vm.loading = false;
          });
        }
      /* } else {
        showError('Informações obrigatórias não foram preenchidas');
        vm.loading = false;
      } */
    };

    /**
     * Valida se o form pode ser submetido
     */
    vm.isValid = function () {
      if (vm.resetType == 'CREATE') {
        return vm.eula && !vm.hasUser;
      } else if (vm.resetType == 'RESET') {
        return true;
      }
      return ((vm.birthDate != null) && (vm.birthDate != ''));
    }

    vm.markEula = function () {
      vm.eula = true;
    }

    vm.getSubmmitBtnMsg = function () {
      if (vm.resetType == 'CREATE') {
        return 'Criar conta';
      } else {
        return 'Alterar senha';
      }
    }

    vm.hasUsername = function () {
      if (vm.username) {
        UserService.hasUsername().query({
          username: vm.username,
          type: vm.type
        }, function (result) {
          result.$promise.then(function (data) {

            vm.hasUser = data.hasUser;

          }, function () {
            showError('Erro ao verificar se login já existe.');
          });
        });
      }
    }

    vm.reset = function () {
      vm.new = '';
      vm.confirm = '';
      showForm();
    }

    vm.isCheckPassword = function () {
      return ((vm.confirm !== null) && (vm.confirm !== ''));
    }

  }
})();