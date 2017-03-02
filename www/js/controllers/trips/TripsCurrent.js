'use strict';

app.controller('CurrentTripsCtrl', function($scope, Trips, Places){

	Trips.getAllTrips()
		.then((data) => {
			let trips = [];
			Object.keys(data).forEach((key) => {
				data[key].id = key;
				trips.push(data[key]);
			});
			$scope.upcomingTrips = trips;
		});

    $scope.cancelTrip = ( (trip) => {
        Trips.deleteTrip(trip)
            .then((data) => {
                console.log('data', data);
                $window.location.href = `#/trips/all`;
            });
    });

});