let app = angular.module('Trippr', ['ionic']);

app.run(function($ionicPlatform, fbCreds) {
    $ionicPlatform.ready(function() {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            cordova.plugins.Keyboard.disableScroll(true);

        }
        if (window.StatusBar) {
            // org.apache.cordova.statusbar required
            StatusBar.styleDefault();
        }
    });

    // Firebase for Chats
    let fb = fbCreds;
    let authConfig = {
        apiKey: fb.apiKey,
        authDomain: fb.authDomain
    };
    firebase.initializeApp(authConfig);
});

app.config(function($httpProvider, $stateProvider, $urlRouterProvider) {

    $httpProvider.defaults.xsrfCookieName = 'csrftoken';
    $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';

    $stateProvider

        .state('register', {
            url: '/register',
            templateUrl: 'templates/register.html',
            controller: 'AuthCtrl'
        })
        .state('login', {
            url: '/login',
            templateUrl: 'templates/login.html',
            controller: 'AuthCtrl'
        })

    .state('tab', {
            url: '/tab',
            abstract: true,
            templateUrl: 'templates/tabs.html'
        })

// PLACES
        .state('tab.places', {
            url: '/places',
            views: {
                'tab-places': {
                    templateUrl: 'templates/tab-places.html',
                    controller: 'PlacesCtrl'
                }
            }
        })

// MAP (CURRENT TRIP)
        .state('tab.map', {
            url: '/map',
            views: {
              'tab-map': {
                templateUrl: 'templates/tab-map.html',
                controller: 'AppCtrl'
              }
            }
        })

// GUIDES
        .state('tab.guides', {
            url: '/guides',
            views: {
                'tab-guides': {
                    templateUrl: 'templates/tab-guides.html',
                    controller: 'GuidesCtrl'
                }
            }
        })

// PROFILE
        .state('tab.profile', {
          url: '/profile',
          views: {
            'tab-profile': {
              templateUrl: 'templates/tab-profile.html',
              controller: 'ProfileCtrl'
            }
          }
        })
        .state('tab.profile-trips', {
            url: '/profile/trips',
            views: {
                'tab-profile': {
                    templateUrl: 'templates/profile-trips.html',
                    controller: 'ProfileCtrl'
                }
            }
        })
        .state('tab.profile-tripsnew', {
          views: {
            'tab-profile': {
              templateUrl: 'templates/profile-tripsnew.html',
              controller: 'NewTripCtrl'
            }
          }
        })
        .state('tab.profile-cars', {
            url: '/profile/cars',
            views: {
                'tab-profile': {
                    templateUrl: 'templates/profile-cars.html',
                    controller: 'ProfileCtrl'
                }
            }
        })
        .state('tab.profile-carsnew', {
          views: {
            'tab-profile': {
              templateUrl: 'templates/profile-carsnew.html',
              controller: 'NewCarCtrl'
            }
          }
        })
        .state('tab.profile-places', {
            url: '/profile/places',
            views: {
                'tab-profile': {
                    templateUrl: 'templates/profile-places.html',
                    controller: 'ProfileCtrl'
                }
            }
        })

    $urlRouterProvider.otherwise('/login');

});
