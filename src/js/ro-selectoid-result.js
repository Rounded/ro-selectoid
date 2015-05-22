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
