/////////////////////////
////// App / Nav ///////
///////////////////////

app.controller('AppCtrl', function($scope, $state, $ionicSideMenuDelegate, Root) {

    $scope.user = {};

    $scope.showMenu = function() {
        $ionicSideMenuDelegate.toggleLeft();
    };

    $scope.showRightMenu = function() {
        $ionicSideMenuDelegate.toggleRight();
    };

    $scope.newTripForm = function() {
        $state.go('tab.profile-tripsnew');
    };

    $scope.newCarForm = function() {
        $state.go('tab.profile-carsnew');
    };

    $scope.showGuides = function() {
        $state.go('tab.guides');
    };

    $scope.viewSavedPlaces = function() {
        $state.go('tab.profile-places');
    };

    $scope.viewSavedTrips = function() {
        $state.go('tab.profile-trips');
    };

    $scope.viewSavedCars = function() {
        $state.go('tab.profile-cars');
    };

    $scope.viewSettings = function() {
        console.log('Clicked settings...');
    };

    $scope.logout = function() {
        console.log('Clicked logout...');
    };

});

/////////////////////////
////// User Auth ///////
///////////////////////

app.controller('AuthCtrl', function($scope, Root, $state, $http) {

    $scope.register = function() {
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
                // "username": $scope.user.username,
                // "password": $scope.user.password
                "username": "John1234",
                "password": "Pass1234"
            }
        }).then((response) => {
            Root.setToken(response.data.token);
            if (response.data.token !== '') {
                $state.go('tab.places');
            }
        });
    };
});

/////////////////////////
//////// Places ////////
///////////////////////

app.controller('PlacesCtrl', function($scope, $state, Places, Root) {
    console.log('PlacesCtrl');
    $scope.getPlaces = Places.listPlaces()
        .then((response) => {
            $scope.places = response;
        });
});

/////////////////////////
////////// Map /////////
///////////////////////

app.controller('MapCtrl', function($scope, $state, $cordovaGeolocation) {
    console.log('MapCtrl');

    var options = {timeout: 10000, enableHighAccuracy: true};
      $cordovaGeolocation.getCurrentPosition(options)

    // navigator.geolocation.getCurrentPosition(options)
        .then(function(position){
            console.log('position', position);

      var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
      console.log(latLng);
      var mapOptions = {
        center: latLng,
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      };

      console.log("document.getElementById(", document.getElementById("map"))

      $scope.map = new google.maps.Map(document.getElementById("map"), mapOptions);
      console.log($scope.map);
    }, function(error){
      console.log("Could not get location");
    });
///////





    // function initialize() {
        // navigator.geolocation.getCurrentPosition(geolocationSuccess);
    // }

    // ionic.Platform.ready(initialize);

});


/////////////////////////
//////// Guides ////////
///////////////////////

app.controller('GuidesCtrl', function($scope, Root) {
    console.log('GuidesCtrl');

});

/////////////////////////
/////// Profile ////////
///////////////////////

app.controller('ProfileCtrl', function($scope, $state, Root, Trips, Fuel) {
    console.log('ProfileCtrl');


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
});

////// Cars //////

app.controller('NewCarCtrl', function($scope, Fuel, Cars, Root, $http) {
    console.log('NewCarCtrl');

    // Populate select options
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

    $scope.newCar = {
        nickname: '',
        make: '',
        model: '',
        year: '',
        fuel_grade: '',
        mpg: 0,
        owner: ''
    };

    // Build newCar from user input
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
    $scope.setMPG = function(newCar) {
        // Called from user click [Save]
        Cars.getCarData(newCar.make, newCar.model, newCar.year)
            .then((response) => {
                newCar.mpg = Math.round((parseInt(response.MPG.city) + parseInt(response.MPG.highway)) / 2);
                $scope.setOwner(newCar);
            });
    };

    $scope.setOwner = function(newCar) {
        newCar.owner = Root.getToken();
        $scope.saveCar(newCar);
    };

    $scope.saveCar = function(car) {
        Cars.createCar(car.nickname, car.fuel_grade, car.mpg);
    };
});

////// Trips //////

app.controller('NewTripCtrl', function($scope, $state, Root, Trips, Maps, Cars, Places, $ionicHistory, $ionicTabsDelegate) {
    console.log('NewTripCtrl');
    // Populate select options
    $scope.states = Maps.getStates();
    Root.getApiRoot()
        .then((root) => {
            Cars.listCars(root.cars)
                .then((response) => {
                    $scope.cars = response;
                });
        });

    $scope.newTrip = {
        name: 'Trip with stops',
        start: {
            city: 'St.Louis',
            state: 'MO'
        },
        end: {
            city: 'Providence',
            state: 'RI'
        },
        car: '',
        owner: '',
        distance: '',
        duration: '',
        id: null
    };

    $scope.startTrip = function(trip) {
        // Instantiate trip, store user and car on trip
        Root.getApiRoot()
            .then((root) => {
                Trips.createTrip(root, trip.name, parseInt(trip.car))
                    .then((response) => {
                        $scope.newTrip.id = response.id;
                        $scope.showDistanceDuration();
                    });
            });
    };

    $scope.showDistanceDuration = function() {
        Maps.getDistanceDuration($scope.newTrip)
            .then((response) => {
                $scope.newTrip.distance = response.distance.text;
                $scope.newTrip.duration = response.duration.text;
                $scope.endPoint($scope.newTrip.start);
                $scope.endPoint($scope.newTrip.end);
            });
    };

    $scope.endPoint = function(place) {
        Root.getApiRoot()
            .then((root) => {
                Places.createPlace(root, place)
                    .then((response) => {
                        Trips.endPoint(root, $scope.newTrip.id, response.id);
                    });
            });
    };

});
