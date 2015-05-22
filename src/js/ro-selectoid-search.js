angular.module('ro.selectoid')
  .directive('roSelectoidSearch', function() {
    return {
      restrict: 'EA',
      replace: true,
      templateUrl: 'ro-selectoid-search.html',
      require: '^roSelectoid',
      link: function(scope, elem, attrs, selectoid) {

      }
    }
  })
