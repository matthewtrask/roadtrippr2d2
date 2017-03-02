// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
// angular.module('starter', ['ionic', 'starter.controllers', 'starter.services'])

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

    let fb = fbCreds;
    let authConfig = {
        apiKey: fb.apiKey,
        authDomain: fb.authDomain
    };
    firebase.initializeApp(authConfig);
})

app.config(function($stateProvider, $urlRouterProvider) {
    $stateProvider
    // setup an abstract state for the tabs directive
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
                controller: 'TripsCtrl'
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

    .state('tab.cars', {
            url: '/cars',
            views: {
                'tab-cars': {
                    templateUrl: 'templates/tab-cars.html',
                    controller: 'ListVehiclesCtrl'
                }
            }
        })
        .state('tab.car-detail', {
            url: '/cars/:carId',
            views: {
                'tab-cars': {
                    templateUrl: 'templates/car-detail.html',
                    controller: 'NewVehicleCtrl'
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
