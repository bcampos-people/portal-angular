(function() {
  'use strict';

  angular
    .module('portalClient')
    .controller('DiagnosticController', DiagnosticController);

  function DiagnosticController(diagnosticFactory, practitionerService, paginationService, EulaService, compartilhamentoFactory, ApplicationProperties, $popup, $filter, $stateParams, $log, $window, $sce, $scope, $mdDialog, $document, LocalStorage, $anchorScroll, $location, $rootScope, $timeout, $http, $state) {
    var vm = this;

    vm.patient = {};
    vm.diagnosticReports = {};
    vm.diagnosticReportsGroupByEncounter = {};
    vm.diagnosticReportsGroupByYear = {};

    vm.diagnosticOrders = {};
    vm.diagnosticOrders.list = []

    vm.loading = true;
    vm.error = false;
    vm.search = '';
    vm.credential = {};
    vm.perfil = '';
    vm.btnclick = false;
    vm.linkToViewer = {};

    // Para filtro dos médicos na tela de compartilhamento
    vm.practitioners = {};
    vm.searchNamePractitioner = '';
    vm.showInfoPagination = false;

    // Para compartilhamento com médicos
    vm.practitionerListToShare = [];
    vm.practitionerIdListToShare = [];
    vm.practitionerListToUnshare = [];
    vm.practitionerIdListToUnshare = [];
    vm.showPopupProcessingSharingEncounter = true;
    vm.showPopupConfirmSharingEncounter = false;
    vm.showPopupErrorSharingEncounter = false;
    vm.typeAction = "";
    vm.practitionersHavePermission = [];

    /* Termo de aceite */
    vm.eulaText = "";

    /* Laudo */
    vm.getLinkToPdf = "";
    vm.fileURLPdf = "";

    vm.isAllowToShare = false;
    vm.showEula = false;

    vm.hasExams = true;

    vm.deliveryNotification = {};

    //Leva o scroll ao topo da página. FIXME: Achar solução definitiva
    $rootScope.$on('$stateChangeSuccess', function() {
      $timeout(function() {
        document.body.scrollTop = document.documentElement.scrollTop = 0;
      }, 5);
    });

    /*offset para a ancora*/
    $anchorScroll.yOffset = 40;

    if (LocalStorage.get('CREDENTIAL')) {
      vm.credential = LocalStorage.getObject('CREDENTIAL');
    } else {
      $state.go('root.login');
    }

    if (vm.credential.type == ApplicationProperties.TYPE_PRACTITIONER) {

      /* Paciente que foi selecionado pelo médico para visualização dos exames */
      if (LocalStorage.get('PATIENT_SELECTED')) {
        vm.patient = LocalStorage.getObject('PATIENT_SELECTED');
      } else {
        $state.go('root.practitioner_list_patient');
      }

      diagnosticFactory.getDiagnosticOrderSharedPractitioner().query({
          idPatient: vm.patient.id,
          idPractitioner: vm.credential.id
        },
        function(result) {
          result.$promise.then(function(data) {
            vm.loading = false;
            vm.diagnosticReports = data;
            vm.diagnosticReportsGroupByEncounter = $filter('diagnosticorderFilter')(vm.diagnosticReports);
            vm.diagnosticReportsGroupByYear = $filter('byYearFilter')(vm.diagnosticReports);
          }, function() {});
        },
        function() {
          vm.loading = false;
          vm.error = true;
          vm.errorMessage = 'Ocorreu em erro';
        });

    } else if (vm.credential.type == ApplicationProperties.TYPE_PATIENT) {

      diagnosticFactory.getAllDiagnosticReports().query({
        idPatient: vm.credential.id
      }).$promise.then(function(data) {
        vm.diagnosticOrders = createObjectDiagnostic(data);
        vm.diagnosticReportsGroupByEncounter = $filter('diagnosticFilter')(vm.diagnosticOrders.list);
        vm.loading = false;
        vm.hasExams = true;
        if (vm.diagnosticReportsGroupByEncounter.length == 0) {
          vm.hasExams = false;
        }
      }, function() {
        vm.loading = false;
        vm.error = true;
        vm.errorMessage = 'Erro interno. Por favor recarregue a página dentro de alguns instantes.';
      });

      vm.loadMoreDiagnostics = function() {
        diagnosticFactory.getPreviousOrNext().query({
          "url": vm.diagnosticOrders.next
        }).$promise.then(function(data) {
          vm.diagnosticOrders = createObjectDiagnostic(data);
          vm.diagnosticReportsGroupByEncounter = $filter('diagnosticFilter')(vm.diagnosticOrders.list);
        }, function() {
          vm.error = true;
          vm.errorMessage = 'Erro interno. Por favor recarregue a página dentro de alguns instantes.';
        });
      }

      var createObjectDiagnostic = function(objectDiagnostic) {
        vm.diagnosticOrders.list = vm.diagnosticOrders.list.concat(objectDiagnostic.dtoList);
        vm.diagnosticOrders.totalItems = objectDiagnostic.total;
        vm.diagnosticOrders.next = objectDiagnostic.urlNext
        vm.diagnosticOrders.previous = objectDiagnostic.urlPrevious
        return vm.diagnosticOrders;
      }
    }

    vm.perfil = function() {
      if (LocalStorage.get('CREDENTIAL')) {
        vm.credential = LocalStorage.getObject('CREDENTIAL');
        if (vm.credential.type == 'PATIENT') {
          return 'p';
        } else {
          return 'm';
        }
      }
    }

    vm.gotoAnchor = function(x) {
      var newHash = 'anchor' + x;
      if ($location.hash() !== newHash) {
        // set the $location.hash to `newHash` and
        // $anchorScroll will automatically scroll to it
        $location.hash('anchor' + x);
      } else {
        // call $anchorScroll() explicitly,
        // since $location.hash hasn't changed
        $anchorScroll();
      }
    };

    vm.markFavorite = function(patient) {
      if (patient.favorite) {
        patient.favorite = false;
      } else {
        patient.favorite = true;
      }
    };

    vm.filterPractitioners = function(encounter) {
      vm.practitioners = {};
      vm.loadingPractitioners = true;

      // Busca lista de médicos
      practitionerService.getPractitioner().query({
          "name": vm.searchNamePractitioner
        },
        function(result) {
          result.$promise.then(function(data) {
            vm.practitioners.data = enableToShare(data.dtoList, encounter);
            vm.practitioners.linkNext = data.urlNext;
            vm.practitioners.linkPrevious = data.urlPrevious;
            vm.practitioners.total = data.total;
            vm.itemInit = 1;
            vm.itemFinal = vm.practitioners.data.length;
            vm.loadingPractitioners = false;
            vm.showInfoPagination = true;
          }, function() {});
        },
        function(error) {
          vm.error = true;
          vm.errorMessage = 'Erro ao filtrar médicos.';
        });
    };

    vm.previousOrNext = function(encounter, type) {
      vm.loadingPractitioners = true;
      if (type === 'previous') {
        vm.pages = vm.practitioners.linkPrevious
      } else if (type === 'next') {
        vm.pages = vm.practitioners.linkNext
      }
      practitionerService.getPreviousOrNext().query({
          "url": vm.pages
        },
        function(result) {
          result.$promise.then(function(data) {
            vm.practitioners.data = enableToShare(data.dtoList, encounter);
            vm.practitioners.linkNext = data.urlNext;
            vm.practitioners.linkPrevious = data.urlPrevious;
            vm.practitioners.total = data.total;
            vm.itemInit = vm.itemInit + vm.itemFinal;
            vm.itemFinal = vm.itemFinal + vm.practitioners.data.length;
            vm.loadingPractitioners = false;
            vm.showInfoPagination = true;
          }, function() {});
        },
        function() {
          vm.error = true;
          vm.errorMessage = 'Ocorreu em erro';
        });
    };

    var enableToShare = function(p, e) {
      for (var j = 0; j < p.length; j++) {
        p[j].isEnableToShare = true;
        for (var i = 0; i < e.sharedWithPractitionersList.length; i++) {
          if (p[j].id == e.sharedWithPractitionersList[i]) {
            p[j].isEnableToShare = false;
          }
        }
      }
      return p;
    }

    var share = function(encounter) {

      //Retorna somente os ID's
      vm.practitionerIdListToShare = vm.practitionerListToShare.map(function(a) {
        return a.id;
      });
      vm.objectAux = {
        "action": "share",
        "idsPractitioner": vm.practitionerIdListToShare,
        "idEncounter": encounter.id
      }
      compartilhamentoFactory.shareDiagnosticsByEncounter().todo(vm.objectAux,
        function(result) {
          result.$promise.then(function() {

            for (var i = 0; i < vm.practitionerListToShare.length; i++) {
              vm.practitionerListToShare[i].isEnableToShare = false;
              encounter.sharedWithPractitionersList.push(vm.practitionerListToShare[i].id);
              encounter.sharedWithPractitionersNameList.push(vm.practitionerListToShare[i].fullName);
            }

            // fechar popup
            vm.practitionersHavePermission = encounter.sharedWithPractitionersNameList;
            vm.showPopupProcessingSharingEncounter = false;
            vm.showPopupConfirmSharingEncounter = true;
            preparePopup();

          }, function() {});
        },
        function() {
          vm.showPopupProcessingSharingEncounter = false;
          vm.showPopupErrorSharingEncounter = true;
        });
    };

    var unshare = function(encounter) {
      vm.practitionerIdListToUnshare = vm.practitionerListToUnshare.map(function(a) {
        return a.id;
      })
      vm.objectAuxUnshare = {
        "action": "unshare",
        "idsPractitioner": vm.practitionerIdListToUnshare,
        "idEncounter": encounter.id
      }
      compartilhamentoFactory.shareDiagnosticsByEncounter().todo(vm.objectAuxUnshare,
        function(result) {
          result.$promise.then(function() {

            for (var i = 0; i < vm.practitionerListToUnshare.length; i++) {
              vm.practitionerListToUnshare[i].isEnableToShare = true;

              // Remove o nome da lista
              var nameIndex = encounter.sharedWithPractitionersNameList.indexOf(vm.practitionerListToUnshare[i].fullName);
              if (nameIndex >= 0) {
                encounter.sharedWithPractitionersNameList.splice(nameIndex, 1);
              }

              var index = encounter.sharedWithPractitionersList.indexOf(vm.practitionerListToUnshare[i].id);
              if (index >= 0) {
                encounter.sharedWithPractitionersList.splice(index, 1);
              }
            }
            // fechar popup
            vm.practitionersHavePermission = encounter.sharedWithPractitionersNameList;
            vm.showPopupProcessingSharingEncounter = false;
            vm.showPopupConfirmSharingEncounter = true;
            preparePopup();
          }, function() {

          });
        },
        function(error) {
          $log.error('Erro ao remover permissão de compartilhamento.');
          vm.showPopupProcessingSharingEncounter = false;
          vm.showPopupErrorSharingEncounter = true;
        });
    };

    var saveData = (function() {
      var a = document.createElement("a");
      document.body.appendChild(a);
      a.style = "display: none";
      return function(data, fileName) {
        var json = JSON.stringify(data),
          blob = new Blob([json], {
            type: "octet/stream"
          }),
          url = window.URL.createObjectURL(blob);
        a.href = url;
        a.download = fileName;
        a.click();
        window.URL.revokeObjectURL(url);
      };
    }());

    vm.linkToViewer = function(exame, isDownload) {
      vm.infoViewerModel = {
        "idUser": vm.credential.id,
        "idDiagnosticReport": exame.id,
        "dateExam": exame.releasedTime.dateTime,
        "profile": vm.credential.type,
        "download": isDownload
      },
      diagnosticFactory.getLinkToViewer().todo(vm.infoViewerModel,
        function(result) {
          var typeVisualization = "";
          result.$promise.then(function(data) {
            if (isDownload) {
              window.location.assign(data.link);
              typeVisualization = "download";
            } else {
              window.open(data.link, '_blank');
              typeVisualization = "viewer";
            }
            sendDeliveryNotification(exame, typeVisualization);
          }, function() {
            return null;
          });
        },
        function() {
          return null;
        }
      );
    }

    vm.addToShareList = function(practitioner) {
      vm.practitionerListToShare.push(practitioner);
      var index = vm.practitionerListToUnshare.indexOf(practitioner);
      if (index >= 0) {
        vm.practitionerListToUnshare.splice(index, 1);
      }
      practitioner.isEnableToShare = false;
      vm.isAllowToShare = true;
      vm.showEula = true;
      vm.btnclick = false;
    };

    vm.addToRemoveList = function(practitioner) {
      vm.practitionerListToUnshare.push(practitioner);
      var index = vm.practitionerListToShare.indexOf(practitioner);
      if (index >= 0) {
        vm.practitionerListToShare.splice(index, 1);
      }
      practitioner.isEnableToShare = true;
      if (vm.practitionerListToShare.length == 0 && vm.practitionerListToUnshare.length > 0) {
        vm.showEula = false;
        vm.btnclick = true;
      }
    };

    vm.confirmShare = function(encounter) {
      vm.btnclick = false;

      // fechar popup "manualmente"
      $popup.close(angular.element('#share1'));
      vm.showPopupProcessingSharingEncounter = true;

      if (vm.practitionerListToShare.length > 0) {
        vm.typeAction = "share"
        share(encounter);
      }
      if (vm.practitionerListToUnshare.length > 0) {
        vm.typeAction = "unshare"
        unshare(encounter);
      }
    };

    /* Limpa os campos para uma nova consulta */
    vm.preparePopup = function() {
      vm.paginate = {};
      vm.btnclick = false;
      vm.searchNamePractitioner = "";
      vm.practitioners = {};
      vm.practitionerListToShare = [];
      vm.practitionerListToUnshare = [];
      vm.showPopupConfirmSharingEncounter = false;
      vm.showPopupErrorSharingEncounter = false;

      /* carrega o termo de uso de compartilhamento de exame */
      EulaService.getEulaShareExams().then(function(data) {
        vm.eulaText = data.text;
      }).catch(function(status) {
        if (status == '500') {
          vm.errorMsg = 'Servidor indisponível';
        } else {
          vm.errorMsg = 'Erro ao carregar o Termo de Uso do Portal.';
        }
      });
    };

    vm.getLinkToPdf = function(diagnosticReport) {
      sendDeliveryNotification(diagnosticReport, "laudo");

      var byteCharacters = atob(diagnosticReport.medicalReport);
      var byteNumbers = new Array(byteCharacters.length);
      for (var j = 0; j < byteCharacters.length; j++) {
        byteNumbers[j] = byteCharacters.charCodeAt(j);
      }
      var byteArray = new Uint8Array(byteNumbers);
      var file = new Blob([byteArray], {
        type: 'application/pdf'
      });
      var fileURL = ($window.URL || $window.webkitURL).createObjectURL(file);
      var trusted = $sce.trustAsResourceUrl(fileURL);
      vm.fileURLPdf = trusted;
    };

    vm.isPractitioner = function() {
      return (vm.credential.type == ApplicationProperties.TYPE_PRACTITIONER);
    };

    vm.isLIS = function(type) {
      return type === 'LIS';
    };


    vm.isRIS = function(type) {
      return type === 'RIS';
    };

    vm.translateEncounterType = function(type) {
      if (type) {
        if (type === 'Externo') {
          return 'Atendimento Ambulatorial';
        } else {
          return type;
        }
      }
    }

    vm.translateOrderType = function(order) {
      if (order.type == 'LIS') {
        return "laboratoriais";
      } else if (order.type == 'RIS') {
        return "de imagem";
      }
    }

    vm.showLoadMoreDiagnostics = function() {
      if (vm.diagnosticOrders.list) {
        if (vm.diagnosticOrders.list.length < vm.diagnosticOrders.totalItems) {
          return true;
        }
      }
      return false;
    }

    vm.updateFilteredData = function(){
      return function (item) {
        var string = JSON.stringify(item).toLowerCase();
        if (vm.search.description){
          var words = vm.search.description.toLowerCase();
          if (words) {
            var filterBy = words.split(/\s+/);
            if (!filterBy.length) {
                return true;
              }
          } else {
              return true;
          }
          return filterBy.every(function (word) {
            var exists = string.indexOf(word);
            if (exists !== -1) {
                return true;
            }
          });
        }
        return true;
      };
    };

    var sendDeliveryNotification = function(exame, typeVisualization) {
      diagnosticFactory.sendDeliveryNotification().todo({
          examId: exame.id,
          userId: vm.credential.id,
          typeUser: vm.credential.type,
          typeVisualization: typeVisualization
        },
        function(result) {
          result.$promise.then(function(data) {
            $log.info('Enviando notificação...');
          }, function() {

          });
        },
        function() {

        }
      );
    }
  }
})();
