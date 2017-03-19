/////////////////////////
////// App / Nav ///////
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
        $state.go('tab.profile-tripsnew');
    };

    $scope.newCarForm = function() {
        $state.go('tab.profile-carsnew');
    };
});

/////////////////////////
////// User Auth ///////
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

app.controller('NewCarCtrl', function($scope, Fuel, Cars, Root, $http) {
    // Populate form options
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

    // Build newCar object from user input
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

// >>>>>>>>>>>
    $scope.setOwner = function(newCar){
      newCar.owner = Root.getToken();
      console.log('newCar', newCar);
      // $scope.car = newCar;
      // $scope.createCar();
    };

    $scope.createCar = function(){

      Root.getApiRoot()
          .then((root) => {
              $http({
                  url: `${root.cars}`, // method
                  method: 'POST',
                  headers: {
                      'Authorization': 'Token ' + Root.getToken()
                  },
                  data: {
                    "nickname": $scope.car.nickname,
                    "owner": $scope.car.owner,
                    "fuel_grade": $scope.car.fuel_grade,
                    "mpg": $scope.car.mpg
                  }
              }).then((response) => {
                  console.log('response', response);
              });
          });
    }
});

////// Trips //////

app.controller('NewTripCtrl', function($scope, Trips, Maps, $state, $ionicHistory, $ionicTabsDelegate) {
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
                    .then(function(response) {
                      console.log('response', response);
                    })
            });
    });
});
