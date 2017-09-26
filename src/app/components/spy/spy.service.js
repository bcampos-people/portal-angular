(function () {
  'use strict';

  angular.module('portalClient')
  .factory('Spy', function Spy(Logging, $log, LocalStorage) {
    //var isMobile = Helper.isMobile();
    var eventStore = [];
    var errorCount = 0;
    var maxErrors = 5;
    // you can also add other things like "mousemove" here…
    var events;
    //            if (isMobile) {
    //                events = ['touchend'];
    //            }
    //            else {
    events = ['click'];
    //            }

    var store = function (type, data) {
      var id = data.target.id;
      var aux = data.target;
      while (!id && aux.parentNode) {
        aux = aux.parentNode;
        id = aux.id;
      }
      var element = data.target.className ? data.target.tagName.toLowerCase() + '.' + data.target.className.split(' ').join('.') : data.target.tagName.toLowerCase();
      var posx, posy;

      if (type !== 'click') {
        var touch = data.changedTouches[0];
        posx = touch.clientX;
        posy = touch.clientY;
      }
      else {
        posx = data.clientX;
        posy = data.clientY;
      }
      if (LocalStorage.getObject('CREDENTIAL')){
      var obj = {
        userId: LocalStorage.getObject('CREDENTIAL').id,
        username: LocalStorage.getObject('CREDENTIAL').name,
        timestamp: new Date().getTime(),
        url: data.target.baseURI,
        xrel: posx + '/' + screen.width,
        yrel: posy + '/' + screen.height,
        elementId: id,
        element: element
      };
      eventStore.push(obj);
    }      
    };

    events.forEach(function (event) {
      document.addEventListener(event, function (data) {
        store(event, data);
      }, false);
    });

    return {
      /**
       * Test listener
       */
      dump: function () {
        $log.debug(eventStore)
      },
      /**
       * Store log data to server, cleaning local log
       */
      store: function () {
        if (eventStore.length > 0) {
          var interactions = eventStore.slice();
          eventStore.length = 0;
          //Sent data to server
          var errcb = function () {
            if (errorCount < maxErrors) {
              errorCount++;
              eventStore = interactions.concat(eventStore);
            }
            // else discards notifications
          };
          var succ = function () {
            errorCount = 0;
          };
          Logging.bulkSave(interactions).$promise.then(succ).catch(errcb);
        }
      }
    };
  });
})();
