(function() {
  'use strict';

  angular
    .module('portalClient')
    .filter('diagnosticorderFilter', function($window, $log, $sce) {

      /* Retorna ou cria um novo grupo com o id de Encounter (Atendimento) informado */
      function getEncounterGroup(encounter, encounterGroups) {
        for (var i = 0; i < encounterGroups.length; i++) {
          if (encounterGroups[i].atendimento.id == encounter.id) {
            return encounterGroups[i];
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
        return obj2.atendimento.period.startDate.dateTime - obj1.atendimento.period.startDate.dateTime;
      }

      return function(diagnosticOrdersNew) {

        // Agrupando por atendimento
        var encounterGroups = [];

        // Agrupando por diagnostic order
        var diagnosticOrderGroups = [];

        for (var i = 0; i < diagnosticOrdersNew.length; i++) {
          var diagnosticOrderNew = diagnosticOrdersNew[i];
          var diagnosticOrderGroupAux;

          if (diagnosticOrderNew.date != null){
            var date = new Date(diagnosticOrderNew.date.dateTime *1000);
            diagnosticOrderNew.formattedDatetime = date;
          }

          if (diagnosticOrderNew.expectedDate != null){
            var expectedDate = new Date(diagnosticOrderNew.expectedDate.dateTime *1000);
            diagnosticOrderNew.expectedDate.dateTime = expectedDate;
          }

          diagnosticOrderGroupAux = {
            diagnosticOrder: diagnosticOrderNew
          };
          diagnosticOrderGroups.push(diagnosticOrderGroupAux);

          /* Adiciona o diagnosticOrderNew na lista de diagnosticos */
          diagnosticOrderGroups.sort(sortByDiagnosticOrderDate);
        }

        for (var j = 0; j < diagnosticOrderGroups.length; j++) {
          var diagnosticOrderItem = diagnosticOrderGroups[j];

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
                diagnosticOrders: []
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
