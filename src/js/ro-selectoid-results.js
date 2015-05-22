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
