(function () {
  'use strict';
  angular
    .module('portalClient')
    .factory('UserService', UserService);

  function UserService(ApplicationProperties, $log, $q, patientService, practitionerService, $resource) {
    var urlBase = ApplicationProperties.BASE_APP;

    var hasUsername = function () {
      return $resource(urlBase + 'user/username', {}, {
          query: { method: 'GET', isArray: false }
        }
      );
    };

    return {

      hasUsername: hasUsername,

      /**
       * Returns the User by login and type
       *
       * @param  {Object}   credential - login info
       * @param  {Function} callback - optional
       * @return {Promise}
       */
      getUser: function (credential, callback) {
        var cb = callback || angular.noop;
        var deferred = $q.defer();

        if (credential != null) {

          if (credential.type == ApplicationProperties.TYPE_PATIENT) {

            patientService.getPatientByEmail(credential).then(function (data) {
              deferred.resolve(data);
              return cb();
            }, function (err) {
              deferred.reject(err);
              return cb(err);
            });

          } else if (credential.type == ApplicationProperties.TYPE_PRACTITIONER) {

            practitionerService.getPractitionerByEmail(credential).then(function (data) {
              deferred.resolve(data);
              return cb();
            }, function (err) {
              deferred.reject(err);
              return cb(err);
            });

          }
        }

        return deferred.promise;
      }
    }
  }
}
)();
