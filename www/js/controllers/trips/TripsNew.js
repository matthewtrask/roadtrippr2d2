'use strict';

app.controller('NewTripCtrl', function($scope, Trips, Maps, $window) {

    $scope.newTrip = {
        name: 'East Coast Road Trip',
        start: {
            city: 'Nashville',
            state: 'TN'
        },
        end: {
            city: 'Providence',
            state: 'RI'
        },
        depart: '',
        arrive: '',
        car: {}
    };

    $scope.states = Maps.getStates();

    $scope.getDistance = ((newTrip) => {
        Maps.getDistance(newTrip)
            .then(function(data){
                newTrip.distStr = data;
                newTrip.distance = parseInt(data.replace(/,/g, ""));
                Trips.createTrip(newTrip)
                    .then(function(){
                        $window.location.href = `#/trips/all`;                        
                    })
            });
    });



});
 