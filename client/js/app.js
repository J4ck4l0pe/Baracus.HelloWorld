var baracusHW = angular.module('HW', ['ngAnimate']);

baracusHW.controller('mainController', ['$scope', '$http', function($scope, $http) {
	$http.get('/api').
		then(function (response) {
			$scope.text = response.data;
		},
		function (response) {
			console.log(response.data);
		});
	$scope.title = 'Hello World!';
	$scope.toggle = false;
}]);