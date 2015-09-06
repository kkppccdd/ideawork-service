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
	
	// set default materials, avoiding a long time blank
	$scope.materials= JSON.parse('[{"_id":"55ebe197a2522a0300008bcb","bucket":"ideawork-material","key":"cartoon-girl/--------------_022.png","lastModifiedTime":"2015-09-06T06:47:51.370Z","tags":["卡通","女孩","韩国"]},{"_id":"55ebe197a2522a0300008bd0","bucket":"ideawork-material","key":"cartoon-girl/--------------_047.png","lastModifiedTime":"2015-09-06T06:47:51.373Z","tags":["卡通","女孩","韩国"]},{"_id":"55ebe197a2522a0300008bd5","bucket":"ideawork-material","key":"cartoon-girl/--------------_018.png","lastModifiedTime":"2015-09-06T06:47:51.375Z","tags":["卡通","女孩","韩国"]},{"_id":"55ebe197a2522a0300008bda","bucket":"ideawork-material","key":"cartoon-girl/--------------_043.png","lastModifiedTime":"2015-09-06T06:47:51.377Z","tags":["卡通","女孩","韩国"]},{"_id":"55ebe197a2522a0300008bdf","bucket":"ideawork-material","key":"cartoon-girl/--------------_015.png","lastModifiedTime":"2015-09-06T06:47:51.379Z","tags":["卡通","女孩","韩国"]},{"_id":"55ebe197a2522a0300008be4","bucket":"ideawork-material","key":"cartoon-girl/--------------_040.png","lastModifiedTime":"2015-09-06T06:47:51.381Z","tags":["卡通","女孩","韩国"]}]');

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