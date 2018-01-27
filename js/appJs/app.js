var mainApp = angular.module("mainApp", ['ngRoute','ngCookies','blockUI']);

function getRoute(name) {
    debugger
    return {
        templateUrl: 'src/view/' + name + '.html?r=' + appVer,
        controller: name + 'Ctrl',
        resolve: {
            load: function ($q, $route, $rootScope) {
                debugger
                var deferred = $q.defer();
                $script(['src/controller/' + name + 'Ctrl.js?r=' + appVer], function () { 
                    $rootScope.$apply(function () { deferred.resolve(); });
                 });
                return deferred.promise;
            }
        }
    }
}
mainApp.config(function ($routeProvider, $controllerProvider, $locationProvider) {
    debugger
    mainApp.registerCtrl = $controllerProvider.register;
    $routeProvider
     .when('/home', getRoute('home'))
     .when('/search', getRoute('search'))     
     .otherwise({ redirectTo: '/home' });

    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    });
});

mainApp.service('appServices', appServices);

mainApp.run(function ($rootScope, $location, $cookies, $http, appServices) {
    debugger
    var token = $cookies.get('userAuthToken');
    if (token) $rootScope.token = token;
    else $rootScope.token = null;

    $http.defaults.headers.common['Auth-Token'] = $rootScope.token;

    $rootScope.$on("$routeChangeStart", function (event, next, current) {
        // Get user if token is there but no user        
        if ($rootScope.mUser == null) {
            if ($rootScope.token) {
                appServices.doActionget('', 'User/GetUserByToken').then(function (d) {
                    if (d.Error == null && (!angular.isUndefined(d.Result))) {
                        $rootScope.mUser = d.Result;
                        //To Do: User RoutePermission Check (If Required)
                        if ($rootScope.mUser != null && next.templateUrl && next.templateUrl.indexOf('SignIn.html') > 0) {
                            $location.path("/Home");
                        }
                        $rootScope.$broadcast('userReady', null);
                    } else {
                        $rootScope.token = null;
                       // $rootScope.goSignin(next.templateUrl);
                    }
                });
            }
            else {
                if (next.templateUrl && next.templateUrl.indexOf('Register.html') > 0)
                {
                    $location.path("/Register");
                } else
                {
                   // if (next.templateUrl) $rootScope.goSignin(next.templateUrl);
                }
            }
        }
        appServices.getBulkData().then(function (d) {
            $rootScope.BulkData = d.Result;
        });

        appServices.doActionget('', 'Master/GetConstants').then(function (d) {
            if (d.Error == null) { $rootScope.Constants = d.Result; }
            else { $rootScope.setMsg(d.Error); }
        });
    });

    //let everthing know that we need to save state now.
    window.onbeforeunload = function (event) {
        $rootScope.$broadcast('savestate');
    };
})

function mainCtrl($scope, $location, $rootScope, $cookies, $http, $timeout, appServices) {
    $rootScope._baseURL = "";
    $rootScope._baseUrlServer = "";
    $rootScope.mUser = null;
    $rootScope.files = {};
    $rootScope.attParam = null;

    $scope.addToken = function (str) { return { Search: str, Token: $rootScope.token }; }

    // $rootScope.setMsg = function (msg, succ) {
    //     debugger
    //     notify.closeAll();
    //    notify({ message: msg, classes: (succ ? "alert-success" : "alert-danger"), duration: 50000000 });
    // }
    // $rootScope.goSignin = function (url) {
    //     if (url && url.indexOf('SignIn.html') < 0) {
    //         $location.path("/SignIn");
    //     }
    // }
   



    $rootScope.logOut = function () {
        // $rootScope.mUser = null;
        // $rootScope.token = null;
        // $rootScope.examMode = false;
        // $cookies.remove('userAuthToken');
        // $cookies.remove('examMode');
        // $http.defaults.headers.common['Auth-Token'] = $rootScope.token;
        // $location.path("/signIn");
    };

    $rootScope.goToLocation = function (path) {
        debugger
        $location.path(path);
    };

    $rootScope.goErrPage = function (aErr) {
        //$rootScope.ErrPage = aErr;
    };

   
}

mainApp.controller('mainCtrl', mainCtrl);



