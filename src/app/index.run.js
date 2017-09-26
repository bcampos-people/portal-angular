(function () {
  'use strict';

  angular
    .module('portalClient')
    .run(runBlock);

  function runBlock($log, Spy, $interval, $location, $rootScope, AuthService, PortalSession, ApplicationProperties) {
    $rootScope.baseUrl = ApplicationProperties.BASE_URL;
    //save the user activity
    $interval(Spy.store, 5000);

    // Redirect to login if route requires auth and you're not logged in
    $rootScope.$on('$stateChangeStart', function (event, next) {

      AuthService.isLoggedInAsync(function (loggedIn) {
        if (next.authenticate && !loggedIn) {
          $location.path('/login');
        }

        //Check if has permission to be here
        if (next.permission && !AuthService.hasPermission(next.permission)) {
          $location.path('/');
        }
      });
    });

    //Check if the session is valid
    $interval(PortalSession.renew, PortalSession.getRefreshSession());
  }
})();
