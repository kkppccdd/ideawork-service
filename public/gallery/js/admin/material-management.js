/**
 * New node file
 */
var materialManagementServices = angular.module('materialManagementServices',
		[ 'ngResource' ]);

materialManagementServices.factory('Material', [ '$resource',
		function($resource, parameters) {
			return $resource("/data/material/:id", parameters);
		} ]);

var materialManagement = angular.module('materialManagement',
		[ "ngRoute",'materialManagementServices' ]);

materialManagement.controller('materialListCtrl', function($scope, Material) {

	$scope.refreshMaterialList = function() {
		console.log($scope.criteria);
		console.log($scope.skip);
		console.log($scope.limit);

		var criteria = $scope.criteria || '{}';
		var parameters = {};
		parameters.criteria = criteria;
		Material.query(parameters, function(data) {
			$scope.materials = data;
		});
	};

	$scope.refreshMaterialList();
});

materialManagement.controller('materialAddTagCtrl', ["$scope","$routeParams", "$location","Material",function($scope, $routeParams, $location, Material) {
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
	
	var materialId = $scope.getQueryVariable('materialId');
	console.log(materialId);
	Material.get({id:materialId},function(item){
		$scope.material=item;
	});
}]);