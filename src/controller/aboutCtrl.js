mainApp.registerCtrl('aboutCtrl', function homeCtrl($q, $route,$scope, $rootScope, $http, $location, $cookies, appServices, blockUI) {
    $scope.pageClass = 'hided';
    $scope.init = function () {
        debugger
        setTimeout(() => {
            debugger
            $scope.pageClass = 'shown';
        }, 300);
       
    }
    $rootScope.setMsg('wow good have to see you',true)
   $scope.init();
});

