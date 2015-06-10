angular.module('ro.selectoid')
  .directive('roSelectoidResult', function() {
    return {
      restrict: 'EA',
      replace: true,
      transclude: true,
      templateUrl: 'ro-selectoid-result.html',
      link: function(scope, elem, attrs, selectoid) {
        
      }
    }
  })
