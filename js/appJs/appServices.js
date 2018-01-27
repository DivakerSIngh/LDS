
function appServices($http, $q, $rootScope, blockUI) {
    return ({
        baseUrlClient: baseUrlClient,
        doLogin: doLogin,
        doAction: doAction,
        routeChange: routeChange,
        chPW: chPW,
        getTable: getTable,
        doActionget: doActionget,
        getSelectedValues: getSelectedValues,
        getSelectedValuesFromArray: getSelectedValuesFromArray,
        getSectors: getSectors,
        getBulkData: getBulkData,
        getRequiredMasterData: getRequiredMasterData
    });
    function baseUrlClient() {
        var _baseUrlClient = $("base").first().attr("href");
        console.log("base url for relative links = " + _baseUrlClient);
        return _baseUrlClient;
    }
    function doLogin(lInfo) {
        //Pace.restart();
        blockUI.start();
        var request = $http({ method: "post", url: $rootScope._baseUrlServer + "api/user/AuthenticateUser", data: lInfo });
        return (request.then(handleSuccess, handleError));
    }
    function doAction(actionParam, path) {
        var request = $http({ method: "post", url: $rootScope._baseUrlServer + "api/" + path, data: actionParam });
        return (request.then(handleSuccess, handleError));
    }
    function doActionget(actionParam, path) {
        var request = $http({ method: "get", url: $rootScope._baseUrlServer + "api/" + path, data: {} });
        return (request.then(handleSuccess, handleError));
    }

    function routeChange(actionParam) {
        $http({ method: "post", url: $rootScope._baseUrlServer + "api/user/routechange", data: actionParam });
    }
    function chPW(userToken, oldPW, newPW) {
        //Pace.restart();
        blockUI.start();
        var request = $http({ method: "post", url: "api/user/changepw", data: { "Token": userToken, "Value": oldPW, "Data": newPW } });
        return (request.then(handleSuccess, handleError));
    }
    function getTable(aTabInfo) {
        //Pace.restart();
        blockUI.start();
        var request = $http({ method: "post", url: $rootScope._baseUrlServer + "api/" + aTabInfo.api, data: aTabInfo });
        return (request.then(handleSuccess, handleError));
    }
    function getSectors() {
        return doAction('', "Sector/GetAllActive");
    }
    function getBulkData() {
        //return doActionget('', "Master/GetBulkMasterData");
    }
    function handleError(response) {
        blockUI.stop();
        var error = response.Error ? response.Error.Message : response.statusText;
        $rootScope.setMsg(error);
        if (response.Error) {
            if (response.Error.Message == $rootScope.Constants.sessionExpired) {
                $rootScope.logOut();
            }
        }
        return ($q.reject(response.statusText));
    }
    function handleErrorUserByToken(response) {
        if (!angular.isObject(response.Error) || !response.Error.Message) return "An unknown error occurred.";
        return (response.statusText);
    }
    function handleSuccess(response) {
        blockUI.stop();
        var data = response.data;
        if (data != null && data.hasOwnProperty("Result")) { return data; }
        else { var result = { Error: { Message: data != null ? data.Message : 'Error occurred !!' } }; return result; }
    }

    function getSelectedValues(elementId) {
        var elements = document.getElementById(elementId);
        var selectedVal = '';
        if (elements != null && elements != undefined) {
            for (var i = 0; i < elements.length; i++) {
                if (elements.options[i].selected)
                    if (selectedVal != '')
                        selectedVal += ', ' + elements.options[i].innerHTML;
                    else
                        selectedVal += elements.options[i].innerHTML;
            }
        }

        return selectedVal;
    }
    function getSelectedValuesFromArray(elementId, data) {
        var elements = document.getElementById(elementId);
        var selectedVal = '';
        var isArray = angular.isArray(data);
        if (elements != null && elements != undefined) {
            for (var i = 0; i < elements.length; i++) {
                if (isArray) {
                    for (var d = 0; d < data.length; d++) {
                        if (parseInt(elements.options[i].value.replace('number:', '')) == parseInt(data[d]))
                            if (selectedVal != '')
                                selectedVal += ', ' + elements.options[i].innerHTML;
                            else
                                selectedVal += elements.options[i].innerHTML;
                    }
                }
                else {
                    if (parseInt(elements.options[i].value.replace('number:', '')) == parseInt(data)) {
                        selectedVal = elements.options[i].innerHTML;
                        break;
                    }
                }
            }
        }
        return selectedVal;
    }

    function getRequiredMasterData(reqMasters) {
        var request = $http({ method: "post", url: $rootScope._baseUrlServer + "api/Master/GetRequiredMasterData", data: reqMasters });
        return (request.then(handleSuccess, handleError));
    }
}

function modalService($modal) {

    var modalDefaults = {
        backdrop: true,
        keyboard: true,
        modalFade: true,
        templateUrl: '../JSMVC/View/modal.html'
    };

    var modalOptions = {
        closeButtonText: 'Close',
        actionButtonText: 'OK',
        headerText: 'Proceed?',
        bodyText: 'Perform this action?'
    };

    this.showModal = function (customModalDefaults, customModalOptions) {
        if (!customModalDefaults) customModalDefaults = {};
        customModalDefaults.backdrop = 'static';
        return this.show(customModalDefaults, customModalOptions);
    };

    this.show = function (customModalDefaults, customModalOptions) {
        //Create temp objects to work with since we're in a singleton service
        var tempModalDefaults = {};
        var tempModalOptions = {};

        //Map angular-ui modal custom defaults to modal defaults defined in service
        angular.extend(tempModalDefaults, modalDefaults, customModalDefaults);

        //Map modal.html $scope custom properties to defaults defined in service
        angular.extend(tempModalOptions, modalOptions, customModalOptions);

        if (!tempModalDefaults.controller) {
            tempModalDefaults.controller = function ($scope, $modalInstance) {
                $scope.modalOptions = tempModalOptions;
                $scope.modalOptions.ok = function (result) {
                    $modalInstance.close(result);
                };
                $scope.modalOptions.close = function (result) {
                    $modalInstance.dismiss('cancel');
                };
            }
        }

        return $modal.open(tempModalDefaults).result;
    };
}
