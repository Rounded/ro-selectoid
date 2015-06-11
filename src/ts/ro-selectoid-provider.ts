interface SelectoidProvider extends ng.IServiceProvider {
  registerEndpoint(name: string, endpoint: any[]): void
}

angular.module('ro.selectoid')
  .provider('roSelectoid', function(): SelectoidProvider {

    var _searchEndpoints = {};
    
    return {
      registerEndpoint: function(name, endpoint) {
        console.log('REGISTERING API:', name, endpoint);
        _searchEndpoints[name] = endpoint;
      },
      $get: function() {
        return {
          searchEndpoints: _searchEndpoints
        }
      }
    }

  })
