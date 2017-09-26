(function () {
  'use strict';

  angular.module('portalClient')
    .factory('PortalSession', function PortalSession(ApplicationProperties, LocalStorage, AuthService, $log) {
      var TOKEN = ApplicationProperties.TOKEN_NAME;

      var getTimeoutToken = function () {
        //Renovar o token do usuáro em 20 minutos
        return (1000 * 60 * 20);
      }

      var getRefreshSession = function () {
        //Renovar o token do usuáro em 18 minutos
        return (1000 * 60 * 18);
      }

      return {

        /**
         * Renova a sessão do usuário, requisitando um novo token
         */
        renew: function () {
          var token = LocalStorage.get(TOKEN);
          if ((token !== 'undefined') && (token !== null)) {
            var idle = LocalStorage.get(ApplicationProperties.IDLE);
            if ((idle !== 'undefined') && (idle !== null)) {
              var now = new Date().getTime();
              var diff = (now - idle);
              if (diff < getTimeoutToken()) {
                AuthService.renewSession(LocalStorage.get(TOKEN)).then(function (data) {
                  if (data) {
                    LocalStorage.put(ApplicationProperties.TOKEN_NAME, data.token);
                  }
                }).catch(function (err) {
                  $log.info(err.message);
                });
              } else {
                $log.info('Session expired');
              }
            }
          }
        },

        /**
         * Tempo de expiração do Token
         */
        getTimeoutToken: getTimeoutToken,

        /**
         * Tempo de renovar o token
         */
        getRefreshSession: getRefreshSession

      };
    });
})();
