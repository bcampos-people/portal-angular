(function() {
  'use strict';
  angular
    .module('portalClient')
    .service('$popup', function($compile, $templateRequest) {
      var vm = this;

      vm.configure = function(content, attrs) {
        var popup = content.find('.popup');

        angular.element('body').css({
          "overflow": "hidden"
        });

        popup.css({
          "display": "inline-block",
          "width": (attrs.popupWidth ? attrs.popupWidth : '600') + "px"
        });

        content.css({
          "display": "block"
        });
        popup.fadeIn(300);
      };

      vm.init = function(attrs, scope) {
        var body = angular.element('body');
        if (attrs.popup) {
          $templateRequest(attrs.popup).then(function(html) {
            var content = $compile(html)(scope);
            body.append(content);
            content.addClass('url_load');
            vm.configure(content, attrs);
          });
        } else {
          vm.configure(angular.element(attrs.popupTemplate).parent(), attrs);
        }
      };

      vm.close = function(elem) {
        var popup;
        if (typeof elem === 'string' || elem instanceof String) {
          popup = angular.element(elem);
        } else {
          popup = elem.closest('.popup');
        }

        popup.parent().fadeOut(400, function() {
          if (popup.parent().hasClass('url_load')) {
            popup.parent().remove();
          }

          angular.element('body').css({
            "overflow": "auto"
          });
        });
      };
    })
    .directive('popup', function($popup) {
      return {
        restrict: 'A',
        link: function(scope, elem, attrs) {
          elem.on('click', function() {
            $popup.init(attrs, scope);
          });
        }
      };
    })
    .directive('popupClose', function($popup) {
      return {
        restrict: 'A',
        link: function(scope, elem) {
          elem.on('click', function() {
            $popup.close(elem);
          });
        }
      };
    })
    .directive('fade', function() {
      return {
        restrict: 'A',
        link: function(scope, elem, attrs) {
          elem.find('span').text(attrs.txtOff);
          elem.on('click', function() {
            angular.element(attrs.fade).fadeToggle(400);
            var $label = elem.text();
            if ($label == attrs.txtOff) {
              elem.find('span').text(attrs.txtOn);
            } else {
              elem.find('span').text(attrs.txtOff);
            }
          });
        }
      };
    });
})();
