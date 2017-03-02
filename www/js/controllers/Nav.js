'use strict';

app.controller('NavCtrl', function($scope) {

    $scope.main = [{
        name: 'Upcoming trips',
        url: '#/trips/all'
    }, {
        name: 'Schedule a new trip',
        url: '#/trips/new'
    }];


});
