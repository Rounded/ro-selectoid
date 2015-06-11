angular.module('ro.selectoid', []);

angular.module('ro.selectoid').provider('roSelectoid', function () {
    var _searchEndpoints = {};
    return {
        registerEndpoint: function (name, endpoint) {
            console.log('REGISTERING API:', name, endpoint);
            _searchEndpoints[name] = endpoint;
        },
        $get: function () {
            return {
                searchEndpoints: _searchEndpoints
            };
        }
    };
});

angular.module('ro.selectoid').directive('roSelectoidResult', function () {
    return {
        restrict: 'EA',
        replace: true,
        transclude: true,
        templateUrl: 'ro-selectoid-result.html'
    };
});

angular.module('ro.selectoid').directive('roSelectoidResults', function () {
    return {
        restrict: 'EA',
        replace: true,
        transclude: true,
        templateUrl: 'ro-selectoid-results.html',
        scope: true,
        require: '^roSelectoid',
        link: function (scope, elem, attrs, selectoid) {
            scope.selectoid = selectoid;
            elem.on('click touchstart', 'a', selectoid.close);
        }
    };
});

angular.module('ro.selectoid').directive('roSelectoidSearch', ['$injector', '$log', 'roSelectoid', function ($injector, $log, roSelectoid) {
    return {
        restrict: 'EA',
        replace: true,
        templateUrl: 'ro-selectoid-search.html',
        require: '^roSelectoid',
        link: function (scope, elem, attrs, selectoid) {
            scope.selectoid = selectoid;
            var endpoint, searcher;
            if (attrs.endpoint) {
                endpoint = roSelectoid.searchEndpoints[attrs.endpoint];
                if (!endpoint) {
                    $log.error('Endpoint "' + attrs.endpoint + '" not found.');
                }
                searcher = $injector.invoke(endpoint);
            }
            else {
                searcher = angular.noop;
            }
            scope.search = function () {
                var query = selectoid.query;
                console.log('SEARCHING FOR:', query);
                var promise = searcher(query).then(function (results) {
                    console.log('GOT RESULTS:', results);
                    if (query === selectoid.query) {
                        selectoid.results = results;
                    }
                });
            };
        }
    };
}]);

angular.module('ro.selectoid').directive('roSelectoidToggle', function () {
    return {
        restrict: 'EA',
        replace: true,
        transclude: true,
        template: function (tElem, tAttrs) {
            var tag = tAttrs.tagName || 'a';
            var html = '<' + tag + ' class="selectoid-toggle" data-ng-click="selectoid.open()" data-ng-transclude></' + tag + '>';
            return html;
        },
        scope: {
            placeholder: '@'
        },
        require: '^roSelectoid',
        link: function (scope, elem, attrs, selectoid) {
            scope.selectoid = selectoid;
        }
    };
});

;
angular.module('ro.selectoid').directive('roSelectoid', function () {
    var instances = 0;
    return {
        restrict: 'EA',
        replace: true,
        transclude: true,
        template: function (tElem, tAttrs) {
            var tag = tAttrs.tagName || 'div';
            var html = '<' + tag + ' class="selectoid" data-ng-transclude></' + tag + '>';
            return html;
        },
        require: 'ngModel',
        scope: true,
        controller: ['$scope', '$element', function ($scope, $element) {
            var selectoid = this;
            var ngModelCtrl = $element.controller('ngModel');
            ngModelCtrl.$render = function () {
                console.log('RENDER WAS CALLED', ngModelCtrl.$viewValue);
            };
            selectoid.select = function (selection) {
                selectoid.selected = selection;
                ngModelCtrl.$setViewValue(selection);
            };
            selectoid.toggleId = 'ro-selectoid-toggle-' + (++instances);
            var backdropHtml = '<div class="selectoid-backdrop"></div>';
            selectoid.open = function () {
                $element.addClass('open');
                angular.element(backdropHtml).insertBefore($element.find('.selectoid-results')).on('click touchstart', selectoid.close);
            };
            selectoid.close = function () {
                angular.element('.selectoid-backdrop').remove();
                $element.removeClass('open');
            };
            selectoid.isOpen = function () {
                return $element.hasClass('open');
            };
            var focusable = 'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, *[tabindex], *[contenteditable]';
            $element.on('keydown', function (evt) {
                if (evt.which !== 38 && evt.which !== 40)
                    return;
                var $target = angular.element(evt.target);
                var $focusableItems;
                if ($target.is('.selectoid-toggle') && evt.which == 40) {
                    if (selectoid.isOpen()) {
                        $element.find('.selectoid-results').find(focusable).first().trigger('focus');
                    }
                    else {
                        selectoid.open();
                    }
                }
                else {
                    $focusableItems = $element.find('.selectoid-results').find(focusable);
                    var focusedIndex = $focusableItems.index(evt.target);
                    var nextFocusedIndex = 0;
                    if (~focusedIndex) {
                        if (evt.which == 38 && focusedIndex > 0) {
                            nextFocusedIndex = focusedIndex - 1;
                        }
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
});

angular.module('ro.selectoid').run(['$templateCache', function($templateCache) {
    $templateCache.put('ro-selectoid-result.html',
        "<div class=\"selectoid-result\" data-ng-transclude></div>\n");
}]);
angular.module('ro.selectoid').run(['$templateCache', function($templateCache) {
    $templateCache.put('ro-selectoid-results.html',
        "<ul class=\"dropdown-menu\" role=\"menu\" data-ng-attr-aria-labelledby=\"{{ dropdown.toggleId }}\" data-ng-transclude></ul>\n");
}]);
angular.module('ro.selectoid').run(['$templateCache', function($templateCache) {
    $templateCache.put('ro-selectoid-search.html',
        "<input class=\"selectoid-search\" type=\"text\" data-ng-model=\"selectoid.query\" data-ng-change=\"search()\">\n");
}]);