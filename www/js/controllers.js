/////////////////////////
///////// App //////////
///////////////////////

app.controller('AppCtrl', function($scope, $ionicSideMenuDelegate, Auth) {

    $scope.showMenu = function() {
        $ionicSideMenuDelegate.toggleLeft();
    };

    $scope.showRightMenu = function() {
        $ionicSideMenuDelegate.toggleRight();
    };

    $scope.logout = function() {
        Auth.logoutUser();
        console.log('Logged out user?');
    };

});

/////////////////////////
///// User Auth ////////
///////////////////////

app.controller('AuthCtrl', function($scope, Auth, $ionicPopup, $state) {

    $scope.data = {};

    $scope.register = function() {
        Auth.createUser($scope.data)
            .then((data) => {
                $state.go('tab.dash');
            });
    };

    $scope.login = function() {
        Auth.loginUser($scope.data.username, $scope.data.password)
            .then((data) => {
                $state.go('tab.dash');
            });
    };

});

/////////////////////////
//////// Places ////////
///////////////////////

app.controller('PlacesCtrl', function($scope, Places) {
    console.log('PlacesCtrl');
    $scope.getPlaces = Places.getAllPlaces()
        .then((response) => {
            $scope.places = response;
        });

});

/////////////////////////
///// Dash / Trips /////
///////////////////////

app.controller('DashCtrl', function($scope, Trips, $state) {
    console.log('DashCtrl');
    Trips.getAllTrips()
        .then((data) => {
            let trips = [];
            Object.keys(data).forEach((key) => {
                data[key].id = key;
                trips.push(data[key]);
            });
            $scope.upcomingTrips = trips;
        });
    $scope.newTripForm = function() {
        $state.go('tab.trip-new');
    };
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

    $scope.goBack = function() {
        $ionicHistory.goBack();
    };

    $scope.continue = function() {
        console.log('clicked continue');
        console.log('newTrip', $scope.newTrip);
        // let viewIndex = ($ionicHistory.currentView().index)
        // let nextView = $ionicTabsDelegate.select(viewIndex+1)
        // $state.go(nextView);
    };

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

    $scope.newCarForm = function() {
        console.log('newCarForm');
        $state.go('tab.car-new');
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


/////////////////////////
///////// Chat /////////
///////////////////////

app.controller('ChatsCtrl', function($scope, Chats) {
    console.log('ChatsCtrl');

    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    //
    //$scope.$on('$ionicView.enter', function(e) {
    //});

    $scope.chats = Chats.all();
    $scope.remove = function(chat) {
        Chats.remove(chat);
    };
});

app.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
    console.log('ChatDetailCtrl');
    $scope.chat = Chats.get($stateParams.chatId);
});

/////////////////////////
///////// Cars /////////
///////////////////////

app.controller('CarsCtrl', function($scope, Cars) {
    console.log('CarsCtrl');

});

app.controller('NewCarCtrl', function($scope, Fuel, Cars) {
    console.log('NewCarCtrl');

    $scope.selectedCar = {
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

    $scope.makeSelected = function(selectedCar) {
        // Filter car models by selected make
        $scope.makes.forEach((make) => {
            if (make.name == selectedCar.make) {
                $scope.models = make.models;
            }
        });
    };

    $scope.modelSelected = function(selectedCar) {
        // Filter car years by selected model
        $scope.models.forEach((model) => {
            if (model.name == selectedCar.model) {
                $scope.years = model.years;
            }
        });
    };

    $scope.getMPG = function(selectedCar) {
        Cars.getCarData(selectedCar.make, selectedCar.model, selectedCar.year)
            .then((response) => {
                selectedCar.mpg = Math.round((parseInt(response.MPG.city) + parseInt(response.MPG.highway)) / 2);
                $scope.saveCar(selectedCar);
            });
    };

    $scope.saveCar = function(selectedCar) {
        console.log('selectedCar', selectedCar);
        // Cars.saveCar(selectedCar);
    };

});

app.controller('CarCtrl', function($scope, Cars, $stateParams) {
    console.log('CarCtrl');
    //     $scope.carId = $stateParams.carId;

    //     Cars.getCarData($scope.carId)
    //         .then((data) => {
    //             $scope.car = data;
    //             console.log('$scope.car', $scope.car)
    //         });
});


/////////////////////////
/////// Profile ////////
///////////////////////

app.controller('AccountCtrl', function($scope) {
    // $scope.settings = {
    //   enableFriends: true
    // };
});
