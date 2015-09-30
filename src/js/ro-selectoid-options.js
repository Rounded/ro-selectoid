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
