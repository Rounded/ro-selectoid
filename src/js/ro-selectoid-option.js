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
