(function() {
  'use strict';

  angular
    .module('portalClient')
    .config(routerConfig);

  function routerConfig($stateProvider, $urlRouterProvider, $httpProvider) {
    //$locationProvider.html5Mode(true);
    $httpProvider.defaults.useXDomain = true;
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
    $stateProvider
      .state('root', {
        url: '',
        abstract: true,
        views: {
          'footer': {
            templateUrl: 'app/components/footer/footer.html',
            controller: 'FooterController',
            controllerAs: 'footer'
          },
          '': {
            template: '<div ui-view  ></div>'
          }
        }
      })
    .state('root.patient-perfil', {
        url: '/patient/perfil',
        templateUrl: 'app/components/patient/perfil/patient-perfil.html',
        controller: 'PatientPerfilController',
        controllerAs: 'patientPerfilController',
        authenticate: true,
        permission: ['PATIENT']
      })
      .state('root.patient-choose-perfil', {
        url: '/patient/perfils',
        templateUrl: 'app/components/patient/perfil-list/patient-choose-perfil.html',
        controller: 'PatientChoosePerfilController',
        controllerAs: 'patientChoosePerfil',
        authenticate: true,
        permission: ['PATIENT']
      })
      .state('root.exame', {
        url: '/exames',
        templateUrl: 'app/components/diagnostics/diagnostic.html',
        controller: 'DiagnosticController',
        controllerAs: 'diagnostic',
        params: {
          patient: null
        },
        authenticate: true,
        permission: ['PATIENT', 'PRACTITIONER']
      })
      .state('root.login', {
        url: '/',
        templateUrl: 'app/components/login/login.html',
        controller: 'LoginController',
        controllerAs: 'login'
      })
      .state('root.password_reset', {
        url: '/reset/:token',
        templateUrl: 'app/components/password/password.html',
        controller: 'PasswordController',
        controllerAs: 'passwordController'
      })
      .state('root.welcome', {
        url: '/welcome/:token',
        templateUrl: 'app/components/password/password.html',
        controller: 'PasswordController',
        controllerAs: 'passwordController'
      })
      .state('root.login_remember', {
        url: '/login/remember',
        templateUrl: 'app/components/login/password-remember/login-email-remember.html',
        controller: 'LoginEmailRememberController',
        controllerAs: 'loginEmailRemember'
      })
      .state('root.practitioner_perfil', {
        url: '/practitioner/perfil',
        templateUrl: 'app/components/practitioner/perfil/practitioner.html',
        controller: 'PractitionerPerfilController',
        controllerAs: 'practitionerPerfil',
        authenticate: true,
        permission: ['PRACTITIONER']
      })
      .state('root.practitioner_list_patient', {
        url: '/practitioner/patients',
        templateUrl: 'app/components/practitioner/list/patient/patient-list.html',
        controller: 'PractitionerListPatientController',
        controllerAs: 'practitionerListPatient',
        authenticate: true,
        permission: ['PRACTITIONER']
      })
      .state('root.organization_list', {
        url: '/organization/list',
        templateUrl: 'app/components/organization/list/organization-list.html',
        controller: 'OrganizationListController',
        controllerAs: 'organizationList',
        authenticate: true,
        permission: ['PATIENT', 'PRACTITIONER']
      })
      .state('root.expired_session', {
        url: '/expired',
        templateUrl: 'app/components/session/expiredSession.html',
        controller: 'ExpiredSessionController',
        controllerAs: 'expiredSessionController',
        authenticate: false
      })
      .state('root.error', {
        url: '/error',
        templateUrl: 'app/components/error/error.html',
        authenticate: false
      });
    $urlRouterProvider.otherwise('/');
  }
})();
