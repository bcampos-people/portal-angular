(function () {
  'use strict';
  angular
    .module('portalClient')
    .factory('practitionerService', PractitionerService);

  function PractitionerService($resource, $http, $q, ApplicationProperties) {
    var urlBase = ApplicationProperties.BASE_APP + 'api/Practitioner/';

  /**
    * Obtém uma lista de médicos. Pode ser informado o identificador, ou uma string para filtrar por nome.
    * Exemplos nos arquivos: PractitionerPerfilController e DiagnosticController
    */
    var getPractitioner = function () {
      return $resource(urlBase + ':idPractitioner',
        { 'idPractitioner': '@idPractitioner' },
        {
          get: { method: 'GET', isArray: false },
          query: {method: 'GET', isArray: false, params: {}}
        }
      );
    };

    var getPreviousOrNext = function () {
      return $resource(urlBase + 'pages',
        {},
        {
          query: {method: 'GET', isArray: false}
        }
      );
    };

    return {
      getPractitioner: getPractitioner,
      getPreviousOrNext: getPreviousOrNext,

      getPractitionerByEmail: function (credential, callback) {
        var cb = callback || angular.noop;
        var deferred = $q.defer();

        $http.post(urlBase + 'username',
          credential.username
        ).
          success(function (data) {
            deferred.resolve(data.dtoList);
            return cb();
          }).
          error(function (err) {
            deferred.reject(err);
            return cb(err);
          }.bind(this));

        return deferred.promise;
      }
    };
  }
}
)();
