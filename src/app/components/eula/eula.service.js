(function () {
  'use strict';
  angular
    .module('portalClient')
    .factory('EulaService', EulaService);

  function EulaService(ApplicationProperties, $http, $q) {

    var urlBase = ApplicationProperties.BASE_APP;

    return {

      /**
       * Solicita o Termo de Uso de Compartilhamento de Exame do Paciente.
       */
      getEulaShareExams: function (callback) {
        var cb = callback || angular.noop;
        var deferred = $q.defer();

        $http.get(urlBase + 'api/eula/share-exams').
          success(function (data) {
            deferred.resolve(data);
            return cb();
          }).
          error(function (err) {
            deferred.reject(err);
            return cb(err);
          }.bind(this));

        return deferred.promise;
      },

      /**
       * Solicita o Termo de Uso de primeiro acesso do Paciente
       */
      getEulaFirstAccessPatient: function (callback) {
        var cb = callback || angular.noop;
        var deferred = $q.defer();

        $http.get(urlBase + 'eula/access/patient').
          success(function (data) {
            deferred.resolve(data);
            return cb();
          }).
          error(function (err) {
            deferred.reject(err);
            return cb(err);
          }.bind(this));

        return deferred.promise;
      },

      /**
       * Solicita o Termo de Uso de primeiro acesso do Médico
       */
      getEulaFirstAccessPractitioner: function (callback) {
        var cb = callback || angular.noop;
        var deferred = $q.defer();

        $http.get(urlBase + 'eula/access/practitioner').
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

    }
  }
}
)();
