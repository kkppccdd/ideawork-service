/**
 * New node file
 */
var materialServices = angular.module('materialServices',
		[ 'ngResource' ]);

materialServices.factory('Material', [ '$resource',
		function($resource, parameters) {
			return $resource("/data/material/:id", parameters);
		} ]);

var materialViewApp = angular.module('materialViewApp',
		[ "ngRoute",'materialServices' ]);

materialViewApp.controller('materialListCtrl', function($scope, Material) {

	$scope.getQueryVariable=function(variable) {
	    var query = window.location.search.substring(1);
	    var vars = query.split('&');
	    for (var i = 0; i < vars.length; i++) {
	        var pair = vars[i].split('=');
	        if (decodeURIComponent(pair[0]) == variable) {
	            return decodeURIComponent(pair[1]);
	        }
	    }
	    console.log('Query variable %s not found', variable);
	};
	
	$scope.useMaterial=function(material){
		console.log(material.key);
		var functionName='useMaterial';
		var arg = 'http://cdn.sinacloud.net/'+material.bucket+'/'+material.key;
		NativeBridge.call(functionName,arg);
	};
	
	$scope.refreshMaterialList = function() {
		var tag = $scope.getQueryVariable('tag');

		var criteria='{}';
		if(tag){
			criteria='{"tags":{"$in":["'+tag+'"]}}';
		}
		var parameters = {};
		parameters.criteria = criteria;
		parameters.limit=100;
		Material.query(parameters, function(data) {
			$scope.materials = data;
		});
	};

	$scope.refreshMaterialList();
});