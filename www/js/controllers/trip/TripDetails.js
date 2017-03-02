'use strict';

app.controller('ViewTripCtrl', function($scope, Trips, $routeParams){

	$scope.tripId = $routeParams.tripId;

	Trips.getTrip($scope.tripId)
		.then((data) => {
			$scope.trip = data;
            console.log('$scope.trip', $scope.trip);
		});

});
