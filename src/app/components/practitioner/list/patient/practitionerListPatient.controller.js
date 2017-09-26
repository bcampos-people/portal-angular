(function() {
  'use strict';

  angular
    .module('portalClient')
    .controller('PractitionerListPatientController', PractitionerListPatientController);

  function PractitionerListPatientController(practitionerListPatientFactory, diagnosticFactory, $filter, $stateParams, $window, $sce, $state, LocalStorage) {
    var vm = this;

    vm.data = {};
    vm.diagnosticReports = [];
    vm.diagnosticReportsAux = [];
    vm.search = [];
    vm.orderBy = 'date';
    vm.onlyFavorite = false;

    vm.loading = true;
    vm.error = false;

    vm.pageNumber = 0;
    vm.pageSize = 0;
    vm.pageLimt = 8;
    vm.pageIncreaseEach = 8;

    vm.patients = [];
    vm.diagnosticsByPatient = [];

    vm.loading = true;

    /* Remove a referencia ao paciente que foi consultado os exames pela ultima vez */
    LocalStorage.remove('PATIENT_SELECTED');

    if (LocalStorage.get('CREDENTIAL')) {
       vm.credential = LocalStorage.getObject('CREDENTIAL');
     }

    practitionerListPatientFactory.getAllPatientsSharedDiagnostics().query({
        idPractitioner: vm.credential.id
      },
      function(result) {
        result.$promise.then(function(data) {
            vm.loading = false;

            vm.data = data;
            vm.pageSize = data.length;

            buildData();

            angular.forEach(vm.patients, function(patient) {
              diagnosticFactory.getNDiagnosticSharedPractitioner().query({
                  idPatient: patient.id,
                  idPractitioner: vm.credential.id,
                  count: 2
                },
                function(result) {
                  result.$promise.then(function(data) {
                    vm.loading = false;

                    patient.diagnostics = data;
                    patient.date = new Date().getTime();

                    if (data && (data.length > 0)) {
                      if (data[0]) {
                        var obj = data[0];
                        var rdsltime = patient.date = obj['releasedTime'];
                        if (rdsltime) {
                          patient.date = rdsltime['dateTime'];
                        }
                      }
                    }
                  }, function() {});
                },
                function() {
                  vm.loading = false;
                  vm.error = true;
                  vm.errorMessage = 'Ocorreu em erro';
                }
              );
            });
          },
          function() {});
      },
      function() {
        vm.loading = false;
        vm.error = true;
        vm.errorMessage = 'Ocorreu em erro';
      });

    var buildData = function() {
      if (vm.pageSize < vm.pageLimt) {
        vm.pageNumber = vm.pageSize;
        vm.patients = vm.data;
        vm.patientsAux = vm.data;
      } else {
        vm.pageNumber = vm.pageLimt;
        vm.patients = vm.data.slice(0, vm.pageNumber);
        vm.patientsAux = vm.data.slice(0, vm.pageNumber);
      }
    };

    vm.showLoadMore = function() {
      if (vm.pageSize > vm.pageLimt) {
        return true;
      }
      return false;
    };

    vm.loadMore = function() {
      vm.pageLimt += vm.pageIncreaseEach;

      buildData();
    };

    vm.markFavorite = function(report) {
      if (report.favorite) {
        report.favorite = false;
      } else {
        report.favorite = true;
      }
    }

    vm.markOnlyFavorite = function() {
      if (vm.onlyFavorite) {
        vm.diagnosticReportsAux = vm.diagnosticReports;
        //vm.diagnosticReports = vm.diagnosticReports.filter(report => report.favorite);
        vm.diagnosticReports = vm.diagnosticReports.filter(function(report) {
          if (report.favorite) {
            return true;
          }
          return false;
        });
      } else {
        vm.diagnosticReports = vm.diagnosticReportsAux;
      }
    }

    vm.goToExame = function(patient) {
      LocalStorage.putObject('PATIENT_SELECTED', patient);
      $state.go('root.exame', { "patient": patient});
    }
  }

})();
