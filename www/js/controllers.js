/////////////////////////
///// Dash / Trips /////
///////////////////////

app.controller('DashCtrl', function($scope, Trips) {
    Trips.getAllTrips()
        .then((data) => {
            let trips = [];
            Object.keys(data).forEach((key) => {
                data[key].id = key;
                trips.push(data[key]);
            });
            $scope.upcomingTrips = trips;
        });

    $scope.cancelTrip = ((trip) => {
        Trips.deleteTrip(trip)
            .then((data) => {
                console.log('data', data);
                $window.location.href = `#/trips/all`;
            });
    });
});

app.controller('TripCtrl', function($scope, Trips, $stateParams) {
    $scope.tripId = $stateParams.tripId;

    Trips.getTrip($scope.tripId)
        .then((data) => {
            $scope.trip = data;
            console.log('$scope.trip', $scope.trip);
        });
});

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

/////////////////////////
////// Companions //////
///////////////////////

app.controller('ChatsCtrl', function($scope, Chats) {

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
    $scope.chat = Chats.get($stateParams.chatId);
});

/////////////////////////
///////// Cars /////////
///////////////////////

app.controller('CarsCtrl', function($scope, Cars) {

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

// app.controller('NewCarCtrl', function($scope) {

// });

/////////////////////////
/////// Profile ////////
///////////////////////

app.controller('AccountCtrl', function($scope) {
    // $scope.settings = {
    //   enableFriends: true
    // };
});
