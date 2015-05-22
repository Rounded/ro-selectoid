angular.module('ro.selectoid', []);

angular.module('ro.selectoid')
  .directive('roSelectoidResult', function() {
    return {
      restrict: 'EA',
      replace: true,
      templateUrl: 'ro-selectoid-result.html',
      link: function(scope, elem, attrs) {

      }
    }
  })

angular.module('ro.selectoid')
  .directive('roSelectoidResults', function() {
    return {
      restrict: 'EA',
      replace: true,
      transclude: true,
      templateUrl: 'ro-selectoid-results.html',
      scope: true,
      require: '^roSelectoid',
      link: function(scope, elem, attrs, selectoid) {
        scope.selectoid = selectoid;
        elem.on('click touchstart', 'a', selectoid.close);
      }
    }
  })

angular.module('ro.selectoid')
  .directive('roSelectoidSearch', function() {
    return {
      restrict: 'EA',
      replace: true,
      templateUrl: 'ro-selectoid-search.html',
      require: '^roSelectoid',
      link: function(scope, elem, attrs, selectoid) {

      }
    }
  })

angular.module('ro.selectoid')
  .directive('roSelectoidToggle', function() {
    return {
      restrict: 'EA',
      replace: true,
      transclude: true,
      template: function(tElem, tAttrs) {
        var tag = tAttrs.tagName || 'a';
        var html = '<' + tag + ' class="selectoid-toggle" data-ng-click="selectoid.open()" data-ng-transclude></' + tag + '>';
        return html;
      },
      scope: {
        placeholder: '@'
      },
      require: '^roSelectoid',
      link: function(scope, elem, attrs, selectoid) {
        scope.selectoid = selectoid;
      }
    }
  })

angular.module('ro.selectoid')
  .directive('roSelectoid', function() {

    var instances = 0;

    return {
      restrict: 'EA',
      replace: true,
      transclude: true,
      template: function(tElem, tAttrs) {
        var tag = tAttrs.tagName || 'div';
        var html = '<' + tag + ' class="selectoid" data-ng-transclude></' + tag + '>';
        return html;
      },
      scope: true,
      controller: ['$scope', '$element', function($scope, $element) {

        var dropdown = this;

        // increment instances to assign a unique id for aria-labelledby to use
        dropdown.toggleId = 'ro-selectoid-toggle-' + (++instances);

        var backdropHtml = '<div class="selectoid-backdrop"></div>';

        dropdown.open = function() {
          $element.addClass('open');
          angular.element(backdropHtml)
            .insertBefore($element.find('.dropdown-menu'))
            .on('click touchstart', dropdown.close);
        };

        dropdown.close = function() {
          angular.element('.dropdown-backdrop').remove();
          $element.removeClass('open');
        };

        dropdown.isOpen = function() {
          return $element.hasClass('open');
        };

        // store a selector for focusable elements
        var focusable = 'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, *[tabindex], *[contenteditable]';

        $element.on('keydown', function(evt) {

          if (evt.which !== 38 && evt.which !== 40) return;

          var $target = angular.element(evt.target);
          var $focusableItems;

          // down arrow pressed when focusing dropdown-toggle
          if ($target.is('.selectoid-toggle') && evt.which == 40) {
            if (dropdown.isOpen()) {
              $element.find('.selectoid-results').find(focusable).first().trigger('focus');
            } else {
              dropdown.open();
            }
          } else {
            // select all focusable items within dropdown-menu
            $focusableItems = $element.find('.selectoid-results').find(focusable);
            var focusedIndex = $focusableItems.index(evt.target);
            // default behavior is to focus the first item
            var nextFocusedIndex = 0;
            // if the target is in $focusableItems...
            if (~focusedIndex) {
              // up arrow focuses the previous item
              if (evt.which == 38 && focusedIndex > 0) {
                nextFocusedIndex = focusedIndex - 1;
              }
              // down arrow focuses the next item
              if (evt.which == 40 && focusedIndex < $focusableItems.length - 1) {
                nextFocusedIndex = focusedIndex + 1;
              }
            }

            $focusableItems.eq(nextFocusedIndex).trigger('focus');

          }

        })

      }],
      controllerAs: 'dropdown'
    };
  })

angular.module('ro.selectoid').run(['$templateCache', function($templateCache) {
    $templateCache.put('ro-selectoid-results.html',
        "<ul class=\"dropdown-menu\" role=\"menu\" data-ng-attr-aria-labelledby=\"{{ dropdown.toggleId }}\" data-ng-transclude></ul>\n");
}]);
angular.module('ro.selectoid').run(['$templateCache', function($templateCache) {
    $templateCache.put('ro-selectoid-search.html',
        "<input type=\"text\" data-ng-model=\"selectoid.query\" data-ng-change=\"selectoid.search()\">\n");
}]);