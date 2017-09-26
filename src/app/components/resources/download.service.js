(function() {
  'use strict';
  angular
    .module('portalClient')
    .factory('downloadService', downloadService);
    function downloadService($resource, $window, $sce) {

      var convertToPdf = function(string){
          var byteCharacters = atob(string);
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
          return trusted;
      };

      return {
        convertToPdf: convertToPdf
      };
    }
    })();
