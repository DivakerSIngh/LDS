var mainApp = angular.module("mainApp", ['ngRoute','cgNotify','ngCookies','blockUI']);

function getRoute(name) {
    
    return {
        templateUrl: 'src/view/' + name + '.html?r=' + appVer,
        controller: name + 'Ctrl',
        resolve: {
            load: function ($q, $route, $rootScope) {
                
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
    
    mainApp.registerCtrl = $controllerProvider.register;
    $routeProvider
     .when('/home', getRoute('home'))
     .when('/search', getRoute('search'))    
     .when('/category', getRoute('category'))    
     .when('/about', getRoute('about'))    
     .when('/contact', getRoute('contact')) 
     .when('/signup', getRoute('signup'))  
     .when('/workerdetails', getRoute('workerdetails'))      
     .otherwise({ redirectTo: '/home' });
     

    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    });
});

mainApp.service('appServices', appServices);

mainApp.run(function ($rootScope, $location, $cookies, $http, appServices) {
    
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
      
    });

    //let everthing know that we need to save state now.
    window.onbeforeunload = function (event) {
        $rootScope.$broadcast('savestate');
    };
})

function mainCtrl($scope, $location, $rootScope,notify, $cookies, $http, $timeout, appServices) {
    $rootScope._baseURL = "";
    $rootScope.pageClass = 'hided';
    $rootScope._baseUrlServer = "";
    $rootScope.mUser = null;
    $rootScope.files = {};
    $rootScope.attParam = null;
    $scope.addToken = function (str) { return { Search: str, Token: $rootScope.token }; }
    $timeout(function () {
        
        $rootScope.pageClass = 'shown';
    }, 150);
    $rootScope.setMsg = function (msg, succ) {
        
        notify.closeAll();
       notify({ message: msg, classes: (succ ? "alert-success" : "alert-danger"), duration: 50000000 });
    }
    // $rootScope.goSignin = function (url) {
    //     if (url && url.indexOf('SignIn.html') < 0) {
    //         $location.path("/SignIn");
    //     }
    // }
   



    $rootScope.logOut = function () {
        $rootScope.token = null;
        $cookies.remove('userAuthToken');
        $http.defaults.headers.common['Auth-Token'] = $rootScope.token;
        $location.path("/home");
    };
    $scope.getClass = function (path) {
        return ($location.path().substr(0, path.length) === path) ? 'activeMenu' : '';
      }
    $rootScope.goToLocation = function (path) {
        $rootScope.pageClass = 'hided';
        $location.path(path);
        $timeout(function () {
            $rootScope.pageClass = 'shown';
        }, 150);
       
    };

    $rootScope.goErrPage = function (aErr) {
        //$rootScope.ErrPage = aErr;
    };

   
}

mainApp.controller('mainCtrl', mainCtrl);



