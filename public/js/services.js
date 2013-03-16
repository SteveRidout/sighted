'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('myApp.services', []).
  value('version', '0.1');

angular.module('myApp.dataServices', ['ngResource']) 
  .factory('Item', ['$resource', function($resource){
  var resource = $resource('/api/item', { }, 
 {
      query: {method:'GET', params:{}, isArray:true},
      'create'  : { method: 'POST' },
      index: { method: 'GET', isArray:true }
  });
  return resource;
}]);
