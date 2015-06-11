interface SelectoidToggleScope extends ng.IScope {
  selectoid: Selectoid
  placeholder: string
}

angular.module('ro.selectoid')
  .directive('roSelectoidToggle', function(): ng.IDirective {
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
      link: function(scope: SelectoidToggleScope, elem, attrs, selectoid: Selectoid) {
        scope.selectoid = selectoid;
      }
    }
  })
