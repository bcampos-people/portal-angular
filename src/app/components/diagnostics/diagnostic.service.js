(function() {
  'use strict';
  angular
    .module('portalClient')
    .factory('diagnosticFactory', diagnosticFactory);

  function diagnosticFactory($resource, ApplicationProperties) {
    var urlBase = ApplicationProperties.BASE_APP + 'api/Diagnostic/';

    var getAllDiagnosticOrders = function() {
      return $resource(urlBase + ':idPatient', {}, {
        query: {
          method: 'GET'
        }
      });
    };

    var getAllDiagnosticsByPatient = function() {
      return $resource(urlBase + 'Orders/Patient/:idPatient', {
        'idPatient': '@idPatient'
      }, {
        query: {
          method: 'GET',
          isArray: false
        }
      });
    };

    var getAllDiagnosticReports = function() {
      return $resource(urlBase + 'Reports/Patient/:idPatient', {
        'idPatient': '@idPatient'
      }, {
        query: {
          method: 'GET',
          isArray: false
        }
      });
    };

    var getNDiagnosticSharedPractitioner = function() {
      return $resource(urlBase + 'Patient/:idPatient/Practitioner/:idPractitioner', {
        'idPatient': '@idPatient',
        'idPractitioner': '@idPractitioner'
      }, {
        query: {
          method: 'GET',
          isArray: true
        }
      });
    };

    var getDiagnosticOrderSharedPractitioner = function() {
      return $resource(urlBase + 'Patient/:idPatient/SharedPractitioner/:idPractitioner', {
        'idPatient': '@idPatient',
        'idPractitioner': '@idPractitioner'
      }, {
        query: {
          method: 'GET',
          isArray: true
        }
      });
    };

    var getLinkToViewer = function() {
      return $resource(urlBase + 'link', {}, {
        todo: {
          method: 'POST'
        }
      });
    };

    var getPreviousOrNext = function () {
      return $resource(urlBase + 'pages',
        {},
        {
          query: {method: 'GET', isArray: false}
        }
      );
    };

    var sendDeliveryNotification = function() {
      return $resource(urlBase + 'DeliveryNotification', {
        examId: '@examId',
        userId: '@userId',
        typeUser: '@typeUser',
        typeVisualization: '@typeVisualization'
      }, {
        todo: {
          method: 'POST'
        }
      });
    };

    return {
      getAllDiagnosticOrders: getAllDiagnosticOrders,
      getAllDiagnosticReports: getAllDiagnosticReports,
      getNDiagnosticSharedPractitioner: getNDiagnosticSharedPractitioner,
      getLinkToViewer: getLinkToViewer,
      getAllDiagnosticsByPatient: getAllDiagnosticsByPatient,
      getDiagnosticOrderSharedPractitioner: getDiagnosticOrderSharedPractitioner,
      getPreviousOrNext: getPreviousOrNext,
      sendDeliveryNotification: sendDeliveryNotification
    };
  }
})();
