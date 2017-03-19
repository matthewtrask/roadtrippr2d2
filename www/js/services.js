app.factory('Root', function($http, apiUrl, $q) {
    let secure_token = null;

    let getApiRoot = function() {
        return $http({
            url: apiUrl,
            headers: {
                'Authorization': "Token " + secure_token
            }
        }).then(function(response) {
            console.log('getApiRoot', response);
            return response.data;
        }, function(response) {
            console.log('error', response);
            return $q.reject(response);
        });
    };

    let setToken = function(token) {
        secure_token = token;
    };

    let getToken = function() {
        return secure_token;
    };

    return {
        getApiRoot,
        getToken,
        setToken
    };
});

// DEV
app.factory('Cars', function($http, $q, fbCreds) {

    let getAllMakes = function() {
        // return $http.get(`https://api.edmunds.com/api/vehicle/v2/makes?fmt=json&api_key=${edCreds.apiKey}`)
        return $http.get('/js/dev.json')
            .then(function(response) {
                // console.log('success', response.data);
                return response.data['makes'];
            }, function(response) {
                console.log('error', response.data);
                return $q.reject(response.data);
            });
    };

    let getCarData = function(make, model, year) {
        //return $http.get(`https://api.edmunds.com/api/vehicle/v2/${make}/${model}/${year}/styles?fmt=json&api_key=${edCreds.apiKey}`)
        return $http.get(`/js/dev2.json`)
            .then(function(response) {
                return response.data.styles[0];
            }, function(response) {
                console.log('error', response.data);
                return $q.reject(response.data);
            });
    };

    let saveCar = function(car) {
        return $http({
            url: "http://localhost:8000/cars",
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            data: {
                "nickname": data.nickname,
                "fuel_grade": data.fuel_grade,
                "mpg": data.mpg
            }
        }).then(function(response) {
            console.log('success', response.data);
            return response.data;
        }, function(response) {
            console.log('error', response.data);
            return $q.reject(response.data);
        });


    };

    let getSavedCars = function() {
        return $http.get(`${fbCreds.databaseURL}/cars.json`)
            .then(function(response) {
                console.log('success', response.data);
                return response.data;
            }, function(response) {
                console.log('error', response.data);
                return $q.reject(response.data);
            });
    };

    return {
        getAllMakes,
        getCarData,
        // saveCar,
        // getSavedCars
    };
});

app.factory('Trips', function($http, fbCreds, $q) {

    let createTrip = function(newTrip) {
        console.log('createTrip(newTrip)', newTrip);
        return $http.post(`${fbCreds.databaseURL}/trips.json`, angular.toJson(newTrip))
            .then(function(response) {
                console.log('success', response.data);
                return response.data;
            }, function(response) {
                console.log('error', response.data);
                return $q.reject(response.data);
            });
    };

    let getAllTrips = function() {
        return $http.get(`${fbCreds.databaseURL}/trips.json`)
            .then(function(response) {
                console.log('success', response.data);
                return response.data;
            }, function(response) {
                console.log('error', response.data);
                return $q.reject(response.data);
            });
    };

    let getTrip = function(tripId) {
        return $http.get(`${fbCreds.databaseURL}/trips/${tripId}.json`)
            .then(function(response) {
                console.log('success', response.data);
                return response.data;
            }, function(response) {
                console.log('error', response.data);
                return $q.reject(response.data);
            });
    };

    let deleteTrip = function(trip) {
        console.log('trip', trip);
        return $http.delete(`${fbCreds.databaseURL}/trips/${trip}.json`)
            .then(function(response) {
                console.log('success', response.data);
                getAllTrips();
                return response.data;
            }, function(response) {
                console.log('error', response.data);
                return response.data;
            });
    };

    return {
        createTrip,
        getAllTrips,
        getTrip,
        deleteTrip

    };
});

app.factory('Places', function($http, $q) {

    let getAllPlaces = function() {
        return $http({
            url: "http://localhost:8000/places/",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }
        }).then(function(response) {
            return response.data;
        }, function(response) {
            console.log('error', response);
            return $q.reject(response);
        });
    };

    return {
        getAllPlaces
    };
});


app.factory('Fuel', function($http, $q) {

    let getGasPrices = function() {
        return $http.get(`http://www.fueleconomy.gov/ws/rest/fuelprices`)
            .then(function(response) {
                // console.log('success!', response.data);
                return response.data;
            }, function(response) {
                console.log('error', response.data);
                return $q.reject(response.data);
            });
    };

    return {
        getGasPrices
    }
});

app.factory('Maps', function($http, $q, distCreds) {

    let states = [{
        name: "Alabama",
        abbreviation: "AL"
    }, {
        name: "Alaska",
        abbreviation: "AK"
    }, {
        name: "American Samoa",
        abbreviation: "AS"
    }, {
        name: "Arizona",
        abbreviation: "AZ"
    }, {
        name: "Arkansas",
        abbreviation: "AR"
    }, {
        name: "California",
        abbreviation: "CA"
    }, {
        name: "Colorado",
        abbreviation: "CO"
    }, {
        name: "Connecticut",
        abbreviation: "CT"
    }, {
        name: "Delaware",
        abbreviation: "DE"
    }, {
        name: "District Of Columbia",
        abbreviation: "DC"
    }, {
        name: "Federated States Of Micronesia",
        abbreviation: "FM"
    }, {
        name: "Florida",
        abbreviation: "FL"
    }, {
        name: "Georgia",
        abbreviation: "GA"
    }, {
        name: "Guam",
        abbreviation: "GU"
    }, {
        name: "Hawaii",
        abbreviation: "HI"
    }, {
        name: "Idaho",
        abbreviation: "ID"
    }, {
        name: "Illinois",
        abbreviation: "IL"
    }, {
        name: "Indiana",
        abbreviation: "IN"
    }, {
        name: "Iowa",
        abbreviation: "IA"
    }, {
        name: "Kansas",
        abbreviation: "KS"
    }, {
        name: "Kentucky",
        abbreviation: "KY"
    }, {
        name: "Louisiana",
        abbreviation: "LA"
    }, {
        name: "Maine",
        abbreviation: "ME"
    }, {
        name: "Marshall Islands",
        abbreviation: "MH"
    }, {
        name: "Maryland",
        abbreviation: "MD"
    }, {
        name: "Massachusetts",
        abbreviation: "MA"
    }, {
        name: "Michigan",
        abbreviation: "MI"
    }, {
        name: "Minnesota",
        abbreviation: "MN"
    }, {
        name: "Mississippi",
        abbreviation: "MS"
    }, {
        name: "Missouri",
        abbreviation: "MO"
    }, {
        name: "Montana",
        abbreviation: "MT"
    }, {
        name: "Nebraska",
        abbreviation: "NE"
    }, {
        name: "Nevada",
        abbreviation: "NV"
    }, {
        name: "New Hampshire",
        abbreviation: "NH"
    }, {
        name: "New Jersey",
        abbreviation: "NJ"
    }, {
        name: "New Mexico",
        abbreviation: "NM"
    }, {
        name: "New York",
        abbreviation: "NY"
    }, {
        name: "North Carolina",
        abbreviation: "NC"
    }, {
        name: "North Dakota",
        abbreviation: "ND"
    }, {
        name: "Northern Mariana Islands",
        abbreviation: "MP"
    }, {
        name: "Ohio",
        abbreviation: "OH"
    }, {
        name: "Oklahoma",
        abbreviation: "OK"
    }, {
        name: "Oregon",
        abbreviation: "OR"
    }, {
        name: "Palau",
        abbreviation: "PW"
    }, {
        name: "Pennsylvania",
        abbreviation: "PA"
    }, {
        name: "Puerto Rico",
        abbreviation: "PR"
    }, {
        name: "Rhode Island",
        abbreviation: "RI"
    }, {
        name: "South Carolina",
        abbreviation: "SC"
    }, {
        name: "South Dakota",
        abbreviation: "SD"
    }, {
        name: "Tennessee",
        abbreviation: "TN"
    }, {
        name: "Texas",
        abbreviation: "TX"
    }, {
        name: "Utah",
        abbreviation: "UT"
    }, {
        name: "Vermont",
        abbreviation: "VT"
    }, {
        name: "Virgin Islands",
        abbreviation: "VI"
    }, {
        name: "Virginia",
        abbreviation: "VA"
    }, {
        name: "Washington",
        abbreviation: "WA"
    }, {
        name: "West Virginia",
        abbreviation: "WV"
    }, {
        name: "Wisconsin",
        abbreviation: "WI"
    }, {
        name: "Wyoming",
        abbreviation: "WY"
    }];

    let getStates = function() {
        return states;
    };

    let getDistance = function(newTrip) {
        return $http.get(`https://maps.googleapis.com/maps/api/distancematrix/json?origins=${newTrip.start.city}+${newTrip.start.state}&destinations=${newTrip.end.city}+${newTrip.end.state}&units=imperial&key=${distCreds.apiKey}`)
            .then(function(response) {
                // console.log('success', response.data.rows[0].elements[0].distance.text);
                return response.data.rows[0].elements[0].distance.text;
            }, function(response) {
                console.log('error', response);
                return $q.reject(response);
            });
    };

    return {
        getStates,
        getDistance
    };
});
