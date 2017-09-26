(function() {
  'use strict';

  angular
    .module('portalClient')
    .filter('diagnosticFilter', function($window, $log, $sce) {

      /* Retorna ou cria um novo grupo com o id de Encounter (Atendimento) informado */
      function getEncounterGroup(encounter, encounterGroups) {
        for (var i = 0; i < encounterGroups.length; i++) {
          if (encounterGroups[i].atendimento.id == encounter.id) {
            return encounterGroups[i];
          }
        }
        return null;
      }

      /* Retorna ou cria um novo grupo com o id de Diagnostic Order (Pedido de exame) informado */
      function getDiagnosticOrderGroup(diagnosticOrder, diagnosticOrderGroups) {
        $log.info('> Buscando grupo de pedido de exame ' + diagnosticOrder);
        for (var i = 0; i < diagnosticOrderGroups.length; i++) {
          if (diagnosticOrderGroups[i].diagnosticOrder.id == diagnosticOrder.id) {
            return diagnosticOrderGroups[i];
          }
        }
        return null;
      }

      /* Ordena pela data de pedido - Decrescente */
      function sortByDiagnosticOrderDate(obj1, obj2) {
        if (obj1.diagnosticOrder.date && obj2.diagnosticOrder.date) {
          return obj2.diagnosticOrder.date.dateTime - obj1.diagnosticOrder.date.dateTime;
        }
      }

      /* Ordena pela data de atendimento - Decrescente */
      function sortByEncounterDate(obj1, obj2) {
        return obj2.atendimento.start - obj1.atendimento.start;
      }

      return function(diagnosticReports) {

        // Agrupando por atendimento
        var encounterGroups = [];

        // Agrupando por diagnostic order
        var diagnosticOrderGroups = [];
        for (var i = 0; i < diagnosticReports.length; i++) {
          var diagnosticReport = diagnosticReports[i];
          if (angular.isDefined(diagnosticReport.diagnosticOrderID)) {
            var diagnosticOrderGroupAux = getDiagnosticOrderGroup(diagnosticReport.diagnosticOrder, diagnosticOrderGroups);
            if (!diagnosticOrderGroupAux) {
              diagnosticOrderGroupAux = {
                //atendimento: diagnosticReport.encounterID,
                diagnosticOrder: diagnosticReport.diagnosticOrder,
                diagnostics: []
              };
              diagnosticOrderGroups.push(diagnosticOrderGroupAux);
            }

              var byteCharacters = atob(diagnosticReport.medicalReport);
              var byteNumbers = new Array(byteCharacters.length);
              for (var j = 0; j < byteCharacters.length; j++) {
                byteNumbers[j] = byteCharacters.charCodeAt(j);
              }
              var byteArray = new Uint8Array(byteNumbers);
              var file = new Blob([byteArray], {
                type: 'application/zip'
              });
              var fileURL = ($window.URL || $window.webkitURL).createObjectURL(file);
              var trusted = $sce.trustAsResourceUrl(fileURL);
              diagnosticReport.fileURL = trusted;

            if (diagnosticReport.diagnosticOrder.date != null){
              var date = new Date(diagnosticReport.diagnosticOrder.date.dateTime *1000);
              diagnosticReport.diagnosticOrder.formattedDatetime = date;
            }

            if (diagnosticReport.diagnosticOrder.expectedDate != null){
              var expectedDate = new Date(diagnosticReport.diagnosticOrder.expectedDate.dateTime *1000);
              diagnosticReport.diagnosticOrder.expectedDate.dateTime = expectedDate;
            }

            /* Adiciona o DiagnosticReport na lista de diagnosticos */
            diagnosticOrderGroupAux.diagnostics.push(diagnosticReport);
          }
          diagnosticOrderGroups.sort(sortByDiagnosticOrderDate);
        }

        for (var i = 0; i < diagnosticOrderGroups.length; i++) {
          var diagnosticOrderItem = diagnosticOrderGroups[i];

          if (angular.isDefined(diagnosticOrderItem.diagnosticOrder.encounterID)) {
            var encounterGroup = getEncounterGroup(diagnosticOrderItem.diagnosticOrder.encounter, encounterGroups);
            if (!encounterGroup) {
              /* Convertendo data - Ver smart */
              var startDate = new Date( diagnosticOrderItem.diagnosticOrder.encounter.period.startDate.dateTime *1000);
              diagnosticOrderItem.diagnosticOrder.encounter.formattedStartDatetime = startDate;
              //diagnosticOrderItem.diagnosticOrder.encounter.period.startDate.dateTime = startDate;

              /* Convertendo data - Ver smart */
              if (diagnosticOrderItem.diagnosticOrder.encounter.period.endDate != null) {
                var endDate = new Date(diagnosticOrderItem.diagnosticOrder.encounter.period.endDate.dateTime *1000);
                //diagnosticOrderItem.diagnosticOrder.encounter.period.endDate.dateTime = endDate;
                diagnosticOrderItem.diagnosticOrder.encounter.formattedEndDatetime = endDate;
              }
              encounterGroup = {
                atendimento: diagnosticOrderItem.diagnosticOrder.encounter,
                diagnosticOrders: [],
                diagnostics: []
              };
              encounterGroups.push(encounterGroup);
            }
            encounterGroup.diagnosticOrders.push(diagnosticOrderItem);
          }
          encounterGroups.sort(sortByEncounterDate);
        }
        return encounterGroups;
      };
    });
})();
