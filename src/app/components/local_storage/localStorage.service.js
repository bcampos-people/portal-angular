(function () {
  'use strict';
  angular
    .module('portalClient')
    .factory('LocalStorage', localStorageFactory);

  function localStorageFactory($window) {

    //Evita usuários diferentes em abas diferentes
    $window.addEventListener('storage', updateLogon);
    function updateLogon(event) {
      if ((event.key === 'LOGON_CHANGED')) {
        $window.location.reload();
      }
    }

    return {
      put: function (key, value) {
        $window.localStorage.setItem(key, value);
      },
      get: function (key, defaultValue) {
        return $window.localStorage.getItem(key) || defaultValue;
      },
      putObject: function (key, value) {
        $window.localStorage.setItem(key, angular.toJson(value));
      },
      getObject: function (key) {

        var rawObj = $window.localStorage.getItem(key);
        if (!rawObj) {
          return null;
        }

        var object = angular.fromJson(rawObj);
        return object;
        //return !_.isEmpty(object) ? object : null;
      },
      remove: function (key) {
        $window.localStorage.removeItem(key);
      }
    };
  }
}
)();

