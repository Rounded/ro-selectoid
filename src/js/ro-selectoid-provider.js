angular.module('ro.selectoid')
  .provider('roSelectoid', function() {

    var provider = {};

    var _searchEndpoints = {};

    provider.registerEndpoint= function(name, endpoint) {
      console.log('REGISTERING API:', name, endpoint);
      _searchEndpoints[name] = endpoint;
    };

    provider.$get = function() {
      return {
        searchEndpoints: _searchEndpoints
      };
    };

    return provider;

  })
