(function () {
  'use strict';
  angular
    .module('portalClient')
    .factory('practitionerListPatientFactory', practitionerListPatientFactory);

  function practitionerListPatientFactory($resource, ApplicationProperties) {
    var urlBase = ApplicationProperties.BASE_APP;

    var getAllPatientsSharedDiagnostics = function(){
      return $resource(urlBase + 'api/Patient/Shared/:idPractitioner',
        { 'idPractitioner': '@idPractitioner' },
        {
          query: { method: 'GET', isArray: true }
        }
      );
    };

    var getAllDiagnosticReports = function () {
      return $resource(urlBase + 'api/DiagnosticReport/Practitioner/:idPractitioner',
        { 'idPractitioner': '@idPractitioner' },
        {
          query: { method: 'GET', isArray: true }
        }
      );
    };

    return {
      getAllDiagnosticReports: getAllDiagnosticReports,
      getAllPatientsSharedDiagnostics: getAllPatientsSharedDiagnostics
    };
  }
}
)();
