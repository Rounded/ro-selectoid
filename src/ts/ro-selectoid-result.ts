angular.module('ro.selectoid')
  .directive('roSelectoidResult', function(): ng.IDirective {
    return {
      restrict: 'EA',
      replace: true,
      transclude: true,
      templateUrl: 'ro-selectoid-result.html'
    }
  })
