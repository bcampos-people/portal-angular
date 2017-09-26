(function () {
  'use strict';
  angular
    .module('portalClient')
    .factory('patientService', PatientService);

  function PatientService($resource, ApplicationProperties, $http, $q) {
    var urlBase = ApplicationProperties.BASE_APP + 'api/Patient/';

    var getPatientById = function () {
      return $resource(urlBase + ':idPatient',
        { 'idPatient': '@idPatient' },
        {
          query: { method: 'GET', isArray: false }
        }
      );
    };

    return {
      getPatientById: getPatientById,

      /**
       * 
       */
      getPatientByEmail: function (credential, callback) {
        var cb = callback || angular.noop;
        var deferred = $q.defer();

        $http.post(urlBase + 'email',
          credential.username
        ).
          success(function (data) {
            deferred.resolve(data);
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
