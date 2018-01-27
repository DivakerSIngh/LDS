mainApp.registerCtrl('contactCtrl', function homeCtrl($scope, $rootScope, $http, $location, $cookies, appServices, blockUI) {
    $rootScope.pageClass = 'hided';
    $scope.init = function () {
        setTimeout(() => {
            $rootScope.pageClass = 'shown';
        }, 200);
    }
});