interface SelectoidSearch extends ng.IScope {
  selectoid: Selectoid
  search(): void
}
interface SelectoidSearchAttributes extends ng.IAttributes {
  endpoint: string
}

angular.module('ro.selectoid')
  .directive('roSelectoidSearch', ['$injector', '$log', 'roSelectoid', function($injector, $log, roSelectoid): ng.IDirective {
    return {
      restrict: 'EA',
      replace: true,
      templateUrl: 'ro-selectoid-search.html',
      require: '^roSelectoid',
      link: function(scope: SelectoidSearch, elem: ng.IAugmentedJQuery, attrs: SelectoidSearchAttributes, selectoid: Selectoid) {

        scope.selectoid = selectoid;

        var endpoint, searcher;

        if (attrs.endpoint) {
          endpoint = roSelectoid.searchEndpoints[attrs.endpoint];
          if (!endpoint) { $log.error('Endpoint "' + attrs.endpoint + '" not found.') }
          searcher = $injector.invoke(endpoint);
        } else {
          searcher = angular.noop;
        }

        scope.search = function() {
          var query = selectoid.query;
          console.log('SEARCHING FOR:', query);
          var promise = searcher(query).then(function(results: any[]) {
            console.log('GOT RESULTS:', results);
            // don't overwrite if query has changed
            if (query === selectoid.query) {
              selectoid.results = results;
            }
          });
        };

      } // end link

    };
  }]);
