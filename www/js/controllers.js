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

    $scope.showGuides = function(){
        $state.go('tab.guides');
    };

    $scope.viewSavedPlaces = function(){
        $state.go('tab.profile-places');
    };

    $scope.viewSavedTrips = function(){
        $state.go('tab.profile-trips');
    };

    $scope.viewSavedCars = function(){
        $state.go('tab.profile-cars');
    };

    $scope.viewSettings = function(){
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
                "username": $scope.user.username,
                "password": $scope.user.password
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
    console.log(Root.getToken());
    $scope.getPlaces = Places.getAllPlaces()
        .then((response) => {
            $scope.places = response;
        });
});

/////////////////////////
//////// Guides ////////
///////////////////////

app.controller('GuidesCtrl', function($scope, Root) {
    console.log('GuidesCtrl');
    console.log(Root.getToken());
});

/////////////////////////
/////// Profile ////////
///////////////////////

app.controller('ProfileCtrl', function($scope, $state, Root, Trips, Fuel) {
    console.log('ProfileCtrl');
    console.log(Root.getToken());

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
    console.log(Root.getToken());
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

app.controller('CarsCtrl', function($scope, Root){
    console.log('CarsCtrl');
    console.log(Root.getToken());
});

////// Trips //////

app.controller('NewTripCtrl', function($scope, $state, Root, Trips, Maps, Cars, $ionicHistory, $ionicTabsDelegate) {
    console.log('NewTripCtrl');
    console.log(Root.getToken());
    // Populate select options
    $scope.states = Maps.getStates();
    Cars.listCars();

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
        car: '',
        owner: ''
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
                    .then(function(response) {
                        console.log('response', response);
                    })
            });
    });
});
