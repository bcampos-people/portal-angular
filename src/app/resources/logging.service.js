(function () {
  'use strict';

  angular.module('portalClient')
    .factory('Logging', function ($resource, ApplicationProperties) {
      var urlBase = ApplicationProperties.BASE_APP;
      return $resource(urlBase + 'logging', {

      }, {
          bulkSave: {
            method: 'POST'

          }
        });
    });
})();
