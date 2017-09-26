(function () {
  'use strict';

  angular
    .module('portalClient')
    .config(config)
    .factory('authInterceptor', function ($log, $q, LocalStorage, $injector, $templateCache, ApplicationProperties) {
      var TOKEN = ApplicationProperties.TOKEN_NAME;
      var state;
      return {
        // Add authorization token to headers
        request: function (config) {
          // If the request is a get and the request url is not in $templateCache
          if ((config.method === 'GET' && $templateCache.get(config.url) === undefined) || config.method !== 'GET') {
            config.params = config.params || {};
            config.headers = config.headers || {};

            var tokenJwt = LocalStorage.get(TOKEN); 
            if ((tokenJwt !== 'undefined') && (tokenJwt !== null)) {
              config.headers.Authorization = 'Bearer ' + tokenJwt;
            }
          }
          
          //Atualiza a última interação do usuário (Sessão expirada)
          if (config.url.indexOf('api/auth/session/renew') === -1) {
            LocalStorage.put(ApplicationProperties.IDLE, new Date().getTime());
          }
          
          return config;
        },
        // Intercept 401s and redirect you to login
        responseError: function (response) {
          if (response.status === 401) {
            (state || (state = $injector.get('$state'))).go('root.expired_session');
            return $q.reject(response);
          } else if (response.status === -1) {
            (state || (state = $injector.get('$state'))).go('root.error');
          } else {
            return $q.reject(response);
          }
        }
      };
    });

  /** @ngInject */
  function config($logProvider, toastrConfig, $compileProvider, $httpProvider) {
    // Enable log
    $logProvider.debugEnabled(true);

    // Set options third-party lib
    toastrConfig.allowHtml = true;
    toastrConfig.timeOut = 3000;
    toastrConfig.positionClass = 'toast-top-right';
    toastrConfig.preventDuplicates = true;
    toastrConfig.progressBar = true;

    //Interceptador para inserir TOKEN em todas as requisições HTTP
    $httpProvider.interceptors.push('authInterceptor');

    $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|tel|file|blob):/);

    $httpProvider.defaults.useXDomain = true;
    delete $httpProvider.defaults.headers.common['X-Requested-With'];

    var regexIso8601 = /^(\d{4}|\+\d{6})(?:-(\d{2})(?:-(\d{2})(?:T(\d{2}):(\d{2}):(\d{2})\.(\d{1,})(Z|([\-+])(\d{2}):(\d{2}))?)?)?)?$/;

    function convertDateStringsToDates(input) {
      if (typeof input !== 'object')
        return input;

      for (var key in input) {
        if (!input.hasOwnProperty(key))
          continue;

        var value = input[key];
        var match;
        if (typeof value === 'string' && key === 'birthDate' && (match = value.match(regexIso8601))) {
          var milliseconds = Date.parse(match[0]);
          if (!isNaN(milliseconds)) {
            input[key] = new Date(milliseconds);
          }
        } else if (typeof value === 'object') {
          convertDateStringsToDates(value);
        }
      }
    }

    $httpProvider.defaults.transformResponse.push(function (responseData) {
      convertDateStringsToDates(responseData);
      return responseData;
    });
  }
})();
