'use strict';

app.controller('ListVehiclesCtrl', function($scope, Cars){

    Cars.getSavedCars()
        .then((data) => {
            let cars = [];
            Object.keys(data).forEach((key) => {
                data[key].id = key;
                cars.push(data[key]);
            });
            $scope.savedCars = cars;
        });

});