var myApp = angular.module('myApp', []);

// http for get and post to back end

myApp.controller('AppController', ['$scope', '$http', '$location', function($scope, $http, $location){
	$http.get('/clients').success(function(response){
		console.log('data recieved from server');
		$scope.clients = response;
	});

	$scope.addClient = function(){
		console.log('Adding new cleint...');
		console.log($scope.client.email.length);

		if($scope.client.first_name.length < 2 || $scope.client.last_name.length < 2 || $scope.client.phone.length < 6)
		{	
			console.log(error);
			return error;
		} else{

			$http.post('/clients', $scope.client).success(function(response){
				console.log('Client added');
				//console.log($scope.client.first_name);
				window.location.href='/';
			});

		}

	}

	$scope.editClient = function(id){
		$('#addBtn').remove();
		$http.get('/clients/'+id).success(function(response){
			$scope.client = response;
		});
	}

	$scope.updateClient = function(){
		$http.put('/clients/'+ $scope.client._id, $scope.client).success(function(response){
			console.log('client updated');
			window.location.href='/';
		});
	}

	$scope.deleteClient = function(id){
		$http.delete('/clients/' +id).success(function(response){
			console.log('Client removed');
			window.location.href='/';
		});
	}

}]);

