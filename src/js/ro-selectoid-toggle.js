angular.module('ro.selectoid')
  .directive('roSelectoidToggle', function() {
    return {
      restrict: 'EA',
      replace: true,
      transclude: true,
      template: function(tElem, tAttrs) {
        var tag = tAttrs.tagName || 'a';
        var html = '<' + tag + ' class="selectoid-toggle" data-ng-click="selectoid.open()" data-ng-transclude></' + tag + '>';
        return html;
      },
      scope: {
        placeholder: '@'
      },
      require: '^roSelectoid',
      link: function(scope, elem, attrs, selectoid) {
        scope.selectoid = selectoid;
      }
    }
  })
