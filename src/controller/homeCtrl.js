﻿mainApp.registerCtrl('homeCtrl', function homeCtrl($scope, $rootScope, $http, $location, $cookies, appServices, blockUI) {
    $rootScope.pageClass = 'shown';
    $scope.init = function () {
        setTimeout(() => {
            $rootScope.pageClass = 'shown';
        }, 200);
    }
});