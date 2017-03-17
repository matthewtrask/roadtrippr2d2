let app = angular.module('Trippr', ['ionic', 'ionic-datepicker']);

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
    .state('login', {
        url: '/login',
        templateUrl: 'templates/login.html',
        controller: 'AuthCtrl'
    })
    .state('register', {
        url: '/register',
        templateUrl: 'templates/register.html',
        controller: 'AuthCtrl'
    })
    .state('tab', {
        url: '/tab',
        abstract: true,
        templateUrl: 'templates/tabs.html'
    })
    .state('tab.dash', {
            url: '/dash',
            views: {
                'tab-dash': {
                    templateUrl: 'templates/tab-dash.html',
                    controller: 'DashCtrl'
                }
            }
        })
        .state('tab.trip-new', {
          url: '/dash/new',
          views: {
            'tab-dash': {
                templateUrl: 'templates/trip-new.html',
                controller: 'NewTripCtrl'
            }
          }
        })
        .state('tab.trip-detail', {
          url: '/dash/:tripId',
          views: {
            'tab-dash': {
                templateUrl: 'templates/trip-detail.html',
                controller: 'TripCtrl'
            }
          }
        })
    .state('tab.cars', {
            url: '/cars',
            views: {
                'tab-cars': {
                    templateUrl: 'templates/tab-cars.html',
                    controller: 'CarsCtrl'
                }
            }
        })
        .state('tab.car-detail', {
            url: '/cars/:carId',
            views: {
                'tab-cars': {
                    templateUrl: 'templates/car-detail.html',
                    controller: 'CarCtrl'
                }
            }
        })
        .state('tab.car-new', {
          url: '/cars/new',
          views: {
            'tab-cars': {
              templateUrl: 'templates/car-new.html',
              controller: 'NewCarCtrl'
            }
          }
        })
    .state('tab.chats', {
            url: '/chats',
            views: {
                'tab-chats': {
                    templateUrl: 'templates/tab-chats.html',
                    controller: 'ChatsCtrl'
                }
            }
        })
        .state('tab.chat-detail', {
            url: '/chats/:chatId',
            views: {
                'tab-chats': {
                    templateUrl: 'templates/chat-detail.html',
                    controller: 'ChatDetailCtrl'
                }
            }
        })

    .state('tab.account', {
        url: '/profile',
        views: {
            'tab-account': {
                templateUrl: 'templates/tab-account.html',
                controller: 'AccountCtrl'
            }
        }
    });



    $urlRouterProvider.otherwise('/tab/dash');

});
