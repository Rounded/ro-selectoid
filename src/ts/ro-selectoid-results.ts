interface SelectoidResultsScope extends ng.IScope {
  selectoid: Selectoid
}

angular.module('ro.selectoid')
  .directive('roSelectoidResults', function(): ng.IDirective {
    return {
      restrict: 'EA',
      replace: true,
      transclude: true,
      templateUrl: 'ro-selectoid-results.html',
      scope: true,
      require: '^roSelectoid',
      link: function(scope: SelectoidResultsScope, elem, attrs, selectoid: Selectoid) {
        scope.selectoid = selectoid;
        elem.on('click touchstart', 'a', selectoid.close);
      }
    }
  })
