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
