angular.module('ro.selectoid', []);

angular.module('ro.selectoid')
  .controller('roSelectoidController', ['$scope', '$element', '$attrs', '$transclude', function($scope, $element, $attrs, $transclude) {

    // TODO: allow this to be configured via a provider
    $scope.defaultPlaceholder = 'Select an item...';

    var $selectoid = this;

    $attrs.$observe('disabled', function(isDisabled) {
      // TODO: when isDisabled is true, disable the selectoid
    });

    var ngModel = $element.controller('ngModel');

    if (ngModel) {
      // Expose ngModel to child directives
      $selectoid.ngModel = ngModel;
      ngModel.$render = function() {
        $selectoid.select(ngModel.$viewValue);
      };
    }

    $selectoid.select = function(selection) {
      if (ngModel) {
        ngModel.$setViewValue(angular.copy(selection));
      }
      // TODO: if ngModel is not provided, there should be an onSelect function
      $selectoid.close();
    };

    $selectoid.isOpen = false;

    $selectoid.open = function() {
      $selectoid.isOpen = true;
    };

    $selectoid.close = function() {
      $selectoid.isOpen = false;
    };

    $selectoid.toggle = function() {
      console.log('toggling...');
      if ($selectoid.isOpen) {
        $selectoid.close();
      } else {
        $selectoid.open();
      }
    };

  /*
    $element.on('keydown', function(evt: JQueryEventObject): void {

      if (evt.which !== 38 && evt.which !== 40) return;

      var $target = angular.element(evt.target);

      // down arrow pressed when focusing selectoid-toggle
      if ($target.is('.selectoid-toggle') && evt.which == 40) {
        if (selectoid.isOpen()) {
          $element.find('.selectoid-results').find(focusable).first().trigger('focus');
        } else {
          selectoid.open();
        }
      } else {
        // select all focusable items within selectoid-menu
        $focusableItems = $element.find('.selectoid-results').find(focusable);
        var focusedIndex: number = $focusableItems.index(evt.target);
        // default behavior is to focus the first item
        var nextFocusedIndex: number = 0;
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

    });
  */

}])

angular.module('ro.selectoid')
  .directive('roSelectoidOption', ['$interpolate', function($interpolate) {
    return {
      restrict: 'EAC',
      require: '^roSelectoid',
      scope: {
        value: '='
      },
      link: function(scope, elem, attrs, $selectoid) {
        if (angular.isUndefined(scope.value)) {
          scope.value = $interpolate(elem.text())(scope.$parent);
        }
        elem.bind('click touchend', function() {
          $selectoid.select(angular.copy(scope.value));
          scope.$apply();
        });
      }
    };
  }])

angular.module('ro.selectoid')
  .directive('roSelectoidOptions', function() {
    return {
      restrict: 'EA',
      replace: true,
      templateUrl: 'ro-selectoid/templates/ro-selectoid-options.html',
      require: '^roSelectoid',
      scope: {
        options: '=for',
        parseOptionText: '&display'
      },
      link: function(scope, elem, attrs, $selectoid) {
        scope.optionFilter = function(value) {
          return !angular.equals(value, $selectoid.ngModel.$viewValue);
        };
      }
    };
  })

angular.module('ro.selectoid')
  .directive('roSelectoid', [function() {
    return {
      restrict: 'EA',
      replace: true,
      transclude: true,
      templateUrl: 'ro-selectoid/templates/ro-selectoid.html',
      require: ['roSelectoid', '^ngModel'],
      scope: {
        label: '@',
        placeholder: '@'
      },
      controller: 'roSelectoidController',
      controllerAs: '$selectoid'
    };
  }])

angular.module('ro.selectoid').run(['$templateCache', function($templateCache) {
    $templateCache.put('ro-selectoid/templates/ro-selectoid-options.html',
        "<ul class=\"ro-selectoid-options\">\n  <li class=\"ro-selectoid-option\" ng-repeat=\"option in options | filter:optionFilter\" value=\"option\">{{ parseOptionText({ $option: option }) || option }}</li>\n</ul>\n");
}]);
angular.module('ro.selectoid').run(['$templateCache', function($templateCache) {
    $templateCache.put('ro-selectoid-result.html',
        "<div class=\"selectoid-result\" data-ng-transclude></div>\n");
}]);
angular.module('ro.selectoid').run(['$templateCache', function($templateCache) {
    $templateCache.put('ro-selectoid-results.html',
        "<ul class=\"dropdown-menu\" role=\"menu\" data-ng-attr-aria-labelledby=\"{{ dropdown.toggleId }}\" data-ng-transclude></ul>\n");
}]);
angular.module('ro.selectoid').run(['$templateCache', function($templateCache) {
    $templateCache.put('ro-selectoid-search.html',
        "<input class=\"selectoid-search\" type=\"text\" data-ng-model=\"selectoid.query\" data-ng-change=\"search()\">\n");
}]);
angular.module('ro.selectoid').run(['$templateCache', function($templateCache) {
    $templateCache.put('ro-selectoid/templates/ro-selectoid.html',
        "<div class=\"ro-selectoid\" ng-class=\"{ open: $selectoid.isOpen }\">\n  <div class=\"ro-selectoid-trigger\" ng-click=\"$selectoid.toggle()\">\n    <span class=\"ro-selectoid-label\">{{ label }}</span>\n    <span class=\"ro-selectoid-placeholder\" ng-if=\"!label\">{{ placeholder || defaultPlaceholder }}</span>\n  </div>\n  <div class=\"ro-selectoid-inner\" ng-transclude></div>\n</div>\n");
}]);