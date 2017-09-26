(function() {
  'use strict';
  angular
    .module('portalClient')
    .factory('compartilhamentoFactory', compartilhamentoFactory);

    function compartilhamentoFactory($resource, ApplicationProperties) {
      var urlBase = ApplicationProperties.BASE_APP + 'api/Encounter/';

      var shareDiagnosticsByEncounter = function() {
        return $resource(urlBase + 'sharing', {}, {
          todo: {
            method: 'POST'
          }
        });
      };

      return {
        shareDiagnosticsByEncounter: shareDiagnosticsByEncounter
      };
    }
})();
