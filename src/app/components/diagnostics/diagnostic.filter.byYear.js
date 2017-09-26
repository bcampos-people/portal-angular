(function() {
  'use strict';

  angular
    .module('portalClient')
    .filter('byYearFilter', function() {

      return function(diagnosticReports) {

        // Agrupa  os atendimentos por ano
        var yearGroup = [];

        // Agrupa  os atendimentos por mês
        var monthGroup = [];

        function getYearGroup(yearRef, yearGroupRef) {
          for (var i = 0; i < yearGroupRef.length; i++) {
            if (yearGroupRef[i].year == yearRef) {
              return yearGroupRef[i];
            }
          }
          return null;
        }

        function getMonthGroup(monthRef, monthGroupRef) {
          for (var i = 0; i < monthGroupRef.length; i++) {
            if (monthGroupRef[i].month == monthRef) {
              return monthGroupRef[i];
            }
          }
          return null;
        }

        function sortByYear(obj1, obj2) {
          return obj2.year - obj1.year;
        }

        for (var i = 0; i < diagnosticReports.length; i++) {
          var item = diagnosticReports[i];
          //var eTemp = item.encounter;
          //if (eTemp !== null) {
          var monthG = getMonthGroup(new Date(item.releasedTime).getMonth(), monthGroup);
          if (!monthG) {
            //var m = new Date(item.releasedTime).getMonth();
            monthG = {
              year: new Date(item.releasedTime).getFullYear(),
              month: new Date(item.releasedTime).getMonth(),
              diagnostics: []
            };
            monthGroup.push(monthG);
          }
          monthG.diagnostics.push(item);
          monthGroup.sort(monthG);
        }
        for (var i = 0; i < monthGroup.length; i++) {
          var item = monthGroup[i];
          var yearG = getYearGroup(item.year, yearGroup);
          //var y = item.year;
          if (!yearG) {
            yearG = {
              year: item.year,
              months: []
            };
            yearGroup.push(yearG);
          }
          yearG.months.push(item);

          yearGroup.sort(sortByYear);

        }
        return yearGroup;
      };
    });
})();
