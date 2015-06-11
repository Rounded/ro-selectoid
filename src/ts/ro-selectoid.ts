interface Selectoid extends ng.IScope {
  isOpen(): boolean
  open(): void
  close(): void
  select(selection: any): void
  selected: any
  toggleId: string
  query?: string
  results?: any[]
};

angular.module('ro.selectoid')
  .directive('roSelectoid', function(): ng.IDirective {

    var instances: number = 0;

    return {
      restrict: 'EA',
      replace: true,
      transclude: true,
      template: function(tElem, tAttrs) {
        var tag = tAttrs.tagName || 'div';
        var html = '<' + tag + ' class="selectoid" data-ng-transclude></' + tag + '>';
        return html;
      },
      require: 'ngModel',
      scope: true,
      controller: ['$scope', '$element', function($scope: ng.IScope, $element: ng.IAugmentedJQuery) {

        var selectoid: Selectoid = this;

        var ngModelCtrl: ng.INgModelController = $element.controller('ngModel');

        ngModelCtrl.$render = function() {
          console.log('RENDER WAS CALLED', ngModelCtrl.$viewValue);
        };

        selectoid.select = function(selection) {
          selectoid.selected = selection;
          ngModelCtrl.$setViewValue(selection);
        };

        // increment instances to assign a unique id for aria-labelledby to use
        selectoid.toggleId = 'ro-selectoid-toggle-' + (++instances);

        var backdropHtml: string = '<div class="selectoid-backdrop"></div>';

        selectoid.open = function() {
          $element.addClass('open');
          angular.element(backdropHtml)
            .insertBefore($element.find('.selectoid-results'))
            .on('click touchstart', selectoid.close);
        };

        selectoid.close = function() {
          angular.element('.selectoid-backdrop').remove();
          $element.removeClass('open');
        };

        selectoid.isOpen = function() {
          return $element.hasClass('open');
        };

        // store a selector for focusable elements
        var focusable: string = 'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, *[tabindex], *[contenteditable]';

        $element.on('keydown', function(evt: JQueryEventObject): void {

          if (evt.which !== 38 && evt.which !== 40) return;

          var $target = angular.element(evt.target);
          var $focusableItems: JQuery;

          // down arrow pressed when focusing selectoid-toggle
          if ($target.is('.selectoid-toggle') && evt.which == 40) {
            if (selectoid.isOpen()) {
              $element.find('.selectoid-results').find(focusable).first().trigger('focus');
            } else {
              selectoid.open();
            }
          } else {
            // select all focusable items within selectoid-menu
            $focusableItems = $element.find('.selectoid-results').find(focusable);
            var focusedIndex: number = $focusableItems.index(evt.target);
            // default behavior is to focus the first item
            var nextFocusedIndex: number = 0;
            // if the target is in $focusableItems...
            if (~focusedIndex) {
              // up arrow focuses the previous item
              if (evt.which == 38 && focusedIndex > 0) {
                nextFocusedIndex = focusedIndex - 1;
              }
              // down arrow focuses the next item
              if (evt.which == 40 && focusedIndex < $focusableItems.length - 1) {
                nextFocusedIndex = focusedIndex + 1;
              }
            }

            $focusableItems.eq(nextFocusedIndex).trigger('focus');

          }

        });

      }],
      controllerAs: 'selectoid'
    };
  })
