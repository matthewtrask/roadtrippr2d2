/////////////////////////
///////// App //////////
///////////////////////

app.controller('AppCtrl', function($scope, $state, $ionicSideMenuDelegate) {

    $scope.user = {};

    $scope.showMenu = function() {
        $ionicSideMenuDelegate.toggleLeft();
    };

    $scope.showRightMenu = function() {
        $ionicSideMenuDelegate.toggleRight();
    };

    $scope.logout = function() {
        console.log('Clicked logout...');
    };

    $scope.newTripForm = function() {
        $state.go('trip-new');
    };

    $scope.newCarForm = function() {
        console.log('newCarForm');
        $state.go('tab.profile-carsnew');
    };
});

/////////////////////////
///////// Auth /////////
///////////////////////

app.controller('AuthCtrl', function($scope, Root, $state, $http) {

    $scope.register = function() {
        console.log('$scope.register');

        return $http({
            url: "http://localhost:8000/register_user/",
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            data: {
                "username": $scope.user.username,
                "password": $scope.user.password,
                "email": $scope.user.email,
                "first_name": $scope.user.first_name,
                "last_name": $scope.user.last_name
            }
        }).then((response) => {
            Root.setToken(response.data.token);
            console.log('Root.getToken()', Root.getToken())
            if (response.data.success === true) {
                $state.go('tab.places');
            };
        });
    };

    $scope.login = function() {
        return $http({
            url: "http://localhost:8000/api-token-auth/",
            method: "POST",
            data: {
                "username": $scope.user.username,
                "password": $scope.user.password
            }
        }).then((response) => {
            Root.setToken(response.data.token);
            console.log('Root.getToken()', Root.getToken());
            if (response.data.token !== '') {
                $state.go('tab.places');
            }
        });
    };
});

/////////////////////////
//////// Places ////////
///////////////////////

app.controller('PlacesCtrl', function($scope, $state, Places) {
    console.log('PlacesCtrl');

    $scope.getPlaces = Places.getAllPlaces()
        .then((response) => {
            $scope.places = response;
        });
});

/////////////////////////
//////// Guides ////////
///////////////////////

app.controller('GuidesCtrl', function($scope) {
    console.log('GuidesCtrl');
});

/////////////////////////
/////// Profile ////////
///////////////////////

app.controller('ProfileCtrl', function($scope, $state, Root, Trips, Fuel) {



    $scope.myTrips = function() {
        console.log('clicked myTrips');
        $state.go('tab.profile');
    };

    $scope.myCars = function() {
        console.log('clicked myCars');
        $state.go('tab.profile-cars');
    };

    $scope.myPlaces = function() {
        console.log('clicked myPlaces');
        $state.go('tab.profile-places');
    };
    // $scope.settings = {
    //   enableFriends: true
    // };
});

////// Cars //////

app.controller('NewCarCtrl', function($scope, Fuel, Cars, Root) {
    $scope.newCar = {
        nickname: '',
        make: '',
        model: '',
        year: '',
        fuel: '',
        mpg: 0
    };

    Cars.getAllMakes()
        .then((response) => {
            $scope.makes = response;
        });

    Fuel.getGasPrices()
        .then((response) => {
            let fuelTypes = [];
            Object.keys(response).forEach((type) => {
                let fuelType = {}
                fuelType.price = parseFloat(response[type]);
                fuelType.strPrice = response[type];
                fuelType.strType = type.toUpperCase();
                if (fuelType.strType == 'PREMIUM') {
                    fuelTypes.push(fuelType);
                }
                if (fuelType.strType == 'MIDGRADE') {
                    fuelTypes.push(fuelType);
                }
                if (fuelType.strType == 'REGULAR') {
                    fuelTypes.push(fuelType);
                }
                if (fuelType.strType == 'DIESEL') {
                    fuelTypes.push(fuelType);
                }
            });
            $scope.fuelTypes = fuelTypes;
        });

    $scope.makeSelected = function(newCar) {
        $scope.makes.forEach((make) => {
            if (make.name == newCar.make) {
                $scope.models = make.models;
            }
        });
    };

    $scope.modelSelected = function(newCar) {
        $scope.models.forEach((model) => {
            if (model.name == newCar.model) {
                $scope.years = model.years;
            }
        });
    };

    $scope.getMPG = function(newCar) {
        Cars.getCarData(newCar.make, newCar.model, newCar.year)
            .then((response) => {
                newCar.mpg = Math.round((parseInt(response.MPG.city) + parseInt(response.MPG.highway)) / 2);
                $scope.saveCar(newCar);
            });
    };

    $scope.saveCar = function(newCar) {
        console.log('newCar', newCar);
        Root.getApiRoot()
            .then((root) => {
                console.log('root', root);
                // $http({
                //     url: `${root}/cars.json`,
                //     method: 'POST',
                //     headers: {
                //         'Authorization': 'Token ' + Root.getToken()
                //     }
                // })
                // .then((response) => {
                //     console.log('response', response);
                // });
            });

    };

});

////// Trips //////

app.controller('TripsCtrl', function($scope, Trips, $state) {
    console.log('TripsCtrl')
});

app.controller('TripCtrl', function($scope, Trips, $stateParams) {
    console.log('TripCtrl');
    $scope.tripId = $stateParams.tripId;

    Trips.getTrip($scope.tripId)
        .then((data) => {
            $scope.trip = data;
            console.log('$scope.trip', $scope.trip);
        });
});

app.controller('NewTripCtrl', function($scope, Trips, Maps, $window, $state, $ionicHistory, $ionicTabsDelegate) {
    console.log('NewTripCtrl');

    $scope.states = Maps.getStates();

    $scope.newTrip = {
        name: '',
        start: {
            city: '',
            state: ''
        },
        end: {
            city: '',
            state: ''
        },
        depart: '',
        carId: '',
        plannerId: ''
    };
});

/////////////////////////
//////// Drives ////////
///////////////////////

app.controller('DriveCtrl', function($scope) {
    console.log('DriveCtrl');

    $scope.getDistance = ((newTrip) => {
        Maps.getDistance(newTrip)
            .then(function(data) {
                newTrip.distStr = data;
                newTrip.distance = parseInt(data.replace(/,/g, ""));
                Trips.createTrip(newTrip)
                    .then(function() {
                        $window.location.href = `#/trips/all`;
                    })
            });
    });
});
