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
