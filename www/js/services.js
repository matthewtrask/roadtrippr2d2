app.factory('Root', function(apiUrl, $http, $q) {
    let secure_token = null;

    let getApiRoot = function() {
        return $http({
            url: apiUrl,
            headers: {
                'Authorization': "Token " + secure_token
            }
        }).then(function(response) {
            // console.log('getApiRoot', response.data);
            return response.data;
        }, function(response) {
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

app.factory('Cars', function(Root, $http, $q) {
    // JSON for DEV
    let getAllMakes = function() {
        // return $http.get(`https://api.edmunds.com/api/vehicle/v2/makes?fmt=json&api_key=${edCreds.apiKey}`)
        return $http.get('/js/dev.json')
            .then(function(response) {
                return response.data['makes'];
            }, function(response) {
                return $q.reject(response.data);
            });
    };

    let getCarData = function(make, model, year) {
        //return $http.get(`https://api.edmunds.com/api/vehicle/v2/${make}/${model}/${year}/styles?fmt=json&api_key=${edCreds.apiKey}`)
        return $http.get(`/js/dev2.json`)
            .then(function(response) {
                return response.data.styles[0];
            }, function(response) {
                return $q.reject(response.data);
            });
    };

    let createCar = function(nn, fg, mpg) {
        Root.getApiRoot()
            .then((root) => {
                return $http({
                    url: `${root.cars}`,
                    method: 'POST',
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": "Token " + Root.getToken()
                    },
                    data: {
                        "nickname": nn,
                        "fuel_grade": fg,
                        "mpg": mpg
                    }
                }).then(function(response) {
                    return response.data;
                }, function(response) {
                    return $q.reject(response);
                });
            });
    };

    let listCars = function(url) {
        return $http({
            url: url,
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Token " + Root.getToken()
            }
        }).then(function(response) {
            return response.data;
        }, function(response) {
            return $q.reject(response);
        });
    };

    return {
        getAllMakes,
        getCarData,
        createCar,
        listCars
    };
});

app.factory('Trips', function(Root, $http, $q) {

    let createTrip = function(root, name, car) {
        return $http({
            url: `${root.trips}`,
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Token " + Root.getToken()
            },
            data: {
                "name": name,
                "car": car
            }
        }).then(function(response) {
            return response.data;
        }, function(response) {
            return $q.reject(response);
        });
    };

    let endPoint = function(root, trip, stop){
        return $http({
            url: `${root.stops}`,
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Token " + Root.getToken()
            },
            data: {
                "trip": trip,
                "stop": stop
            }
        }).then(function(response){
            return response.data
        }, function(response){
            return $q.reject(response);
        });
    };

    return {
        createTrip,
        endPoint
    };
});

app.factory('Places', function(Root, $http, $q) {

    let listPlaces = function() {
        return $http({
            url: "http://localhost:8000/places/",
            headers: {
                "Content-Type": "application/json"
            }
        }).then(function(response) {
            return response.data;
        }, function(response) {
            return $q.reject(response);
        });
    };

    let retrievePlace = function(root, placeId) {
        return $http({
            url: `${root.places}${placeId}/`,
            headers: {
                "Content-Type": "application/json"
            }
        }).then(function(response) {
            return response.data
        }, function(response) {
            return $q.reject(response);
        });
    };

    let createPlace = function(root, data) {
        return $http({
            url: `${root.places}`,
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Token " + Root.getToken()
            },
            data: {
                "name": data.name || '',
                "city": data.city,
                "state": data.state
            }
        }).then(function(response) {
            return response.data;
        }, function(response) {
            return $q.reject(response);
        });
    };

    return {
        listPlaces,
        createPlace,
        retrievePlace
    };
});

app.factory('Fuel', function($http, $q) {

    let getGasPrices = function() {
        return $http.get(`http://www.fueleconomy.gov/ws/rest/fuelprices`)
            .then(function(response) {
                return response.data;
            }, function(response) {
                return $q.reject(response.data);
            });
    };

    return {
        getGasPrices
    }
});

app.factory('Maps', function($http, $q, distCreds) {

    let getStates = function() {
        return states;
    };

    let getDistanceDuration = function(newTrip) {
        return $http({
            url: `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${newTrip.start.city}+${newTrip.start.state}&destinations=${newTrip.end.city}+${newTrip.end.state}&units=imperial&key=${distCreds.apiKey}`
        }).then(function(response) {
            return response.data.rows[0].elements[0];
        }, function(response) {
            return $q.reject(response.data);
        });
    };

    let getCurrent = function() {
        console.log('Maps.getCurrent');
    };

    let geoCode = function() {
        console.log('Maps.geoCode');
    };

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

    return {
        getStates,
        getDistanceDuration,
        getCurrent,
        geoCode
    };
});
