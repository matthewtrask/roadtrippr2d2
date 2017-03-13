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
        });
});

app.controller('NewTripCtrl', function($scope, Trips, Maps, $window, $state, $ionicHistory) {
    console.log('NewTripCtrl');

    $scope.goBack = function() {
        $ionicHistory.goBack();
    };

    $scope.states = Maps.getStates();

    $scope.newTrip = {
        name: '',
        start: {
            city: 'Nashville',
            state: 'TN'
        },
        end: {
            city: '',
            state: ''
        },
        depart: '',
        arrive: ''
    };

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

    $scope.selectDate = ((newTrip) => {
        console.log('newTrip', newTrip);
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

app.controller('CarCtrl', function($scope, Cars, $stateParams) {
    console.log('CarCtrl');
    $scope.carId = $stateParams.carId;

    Cars.getCarData($scope.carId)
        .then((data) => {
            $scope.car = data;
            console.log('$scope.car', $scope.car)
        });
});

app.controller('NewCarCtrl', function($scope) {
    console.log('NewCarCtrl');
});

/////////////////////////
/////// Profile ////////
///////////////////////

app.controller('AccountCtrl', function($scope) {
    // $scope.settings = {
    //   enableFriends: true
    // };
});
