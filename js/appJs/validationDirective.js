genesisApp.directive('validText', function ($rootScope) {
    return {
        require: '?ngModel',
        link: function (scope, element, attrs, ngModelCtrl) {

            var camelCase = attrs.checkforcamelcase;

            if (!ngModelCtrl) {
                return;
            }

            ngModelCtrl.$parsers.push(function (val) {
                var clean = val.replace(/[^a-zA-Z ]+/g, '');
                if (val != '' && val !== clean) {
                    $rootScope.setMsg($rootScope.Constants.onlyText);
                    if (camelCase) {
                        clean = (!!clean) ? clean.charAt(0).toUpperCase() + clean.substr(1) : '';
                    }
                    ngModelCtrl.$setViewValue(clean);
                    ngModelCtrl.$render();
                }

                if (camelCase) {
                    clean = (!!clean) ? clean.charAt(0).toUpperCase() + clean.substr(1) : '';
                    ngModelCtrl.$setViewValue(clean);
                    ngModelCtrl.$render();
                }
                return clean;

            });
        }
    };
});

genesisApp.directive('camelCase', function ($rootScope) {
    return {
        require: '?ngModel',
        link: function (scope, element, attrs, ngModelCtrl) {
            if (!ngModelCtrl) {
                return;
            }

            ngModelCtrl.$parsers.push(function (input) {
                var camelCase = (!!input) ? input.charAt(0).toUpperCase() + input.substr(1).toLowerCase() : '';
                ngModelCtrl.$setViewValue(camelCase);
                ngModelCtrl.$render();
                return camelCase;
            });


        }
    };
});

genesisApp.directive('validInteger', function ($rootScope) {
    return {
        require: '?ngModel',
        link: function (scope, element, attrs, ngModelCtrl) {
            if (!ngModelCtrl) {
                return;
            }

            ngModelCtrl.$parsers.push(function (val) {

                var clean = val.replace(/[^0-9]+/g, '');
                if (val != '' && val !== clean) {
                    $rootScope.setMsg($rootScope.Constants.digits)
                    ngModelCtrl.$setViewValue(clean);
                    ngModelCtrl.$render();
                }
                return clean;

            });

            element.bind('keypress', function (event) {
                if (event.keyCode === 32) {
                    event.preventDefault();
                }
            });
        }
    };
});

genesisApp.directive('allow', function ($rootScope) {
    return {
        require: '?ngModel',
        link: function (scope, element, attrs, ngModelCtrl) {
            if (!ngModelCtrl) {
                return;
            }

            ngModelCtrl.$parsers.push(function (val) {
                var clean = val.replace(/[^a-zA-Z0-9 ]/g, '');
                if (val != '' && val !== clean) {
                    $rootScope.setMsg($rootScope.Constants.alphaNumeric)
                    ngModelCtrl.$setViewValue(clean);
                    ngModelCtrl.$render();
                }
                return val;
            });
        }
    };
});

genesisApp.directive('validMobileNumber', function ($rootScope, $compile) {
    return {
        require: '?ngModel',
        link: function (scope, element, attrs, ngModelCtrl) {
            if (!ngModelCtrl) {
                return;
            }
            ngModelCtrl.$parsers.push(function (val) {
                var clean = val.replace(/[^0-9]+/g, '');
                if (val != '') {
                    if (val !== clean || val.length > 10) {
                        if (val.length > 10) {
                            $rootScope.setMsg($rootScope.Constants.mobileNumber);
                            ngModelCtrl.$setViewValue(clean.substring(0, 10));
                        }
                        else {
                            $rootScope.setMsg($rootScope.Constants.digits);
                            ngModelCtrl.$setViewValue(clean);
                        }
                        ngModelCtrl.$render();
                    }
                }
                return clean;

            });

            element.bind('keypress', function (event) {
                if (event.keyCode === 32) {
                    event.preventDefault();
                }
            });

            element.bind('blur', function (event) {
                angular.element(element).removeClass('directiveError');
                if (element.val().length != 10) {
                    $rootScope.setMsg($rootScope.Constants.mobileNumber);
                    angular.element(element).addClass('directiveError');
                }
            });
        }
    };
});

genesisApp.directive('validDecimal', function ($rootScope) {
    return {
        require: '?ngModel',
        link: function (scope, element, attrs, ngModelCtrl) {
            if (!ngModelCtrl) {
                return;
            }

            ngModelCtrl.$parsers.push(function (val) {
                //var re = /\$?\d{1,3}(,?\d{3})*(\.\d{1,2})?/;
                //var re = /^([0-9]{1,10})?(\.[0-9]{1,10})?$/;
                var re = /^\d*\.?\d*$/;
                if (val != '' && !re.test(val)) {

                    $rootScope.setMsg($rootScope.Constants.decimal)
                    if (val != undefined && val.length > 1) {
                        ngModelCtrl.$setViewValue(val.substring(0, val.length - 1));
                    }
                    else {
                        ngModelCtrl.$setViewValue("");
                    }
                    ngModelCtrl.$render();
                }
                return val;
            });

            element.bind('keypress', function (event) {
                if (event.keyCode === 32) {
                    event.preventDefault();
                }
            });
        }
    };
});

genesisApp.directive('isPercentage', function ($rootScope) {
    return {
        require: '?ngModel',
        link: function (scope, element, attrs, ngModelCtrl) {
            if (!ngModelCtrl) {
                return;
            }

            ngModelCtrl.$parsers.push(function (val) {

                var re = /^[\d]*\.?\d*$/;

                if (val != '' && !re.test(val)) {
                    if (val != undefined && val.length > 0) {
                        ngModelCtrl.$setViewValue('');
                        ngModelCtrl.$render();
                        $rootScope.setMsg($rootScope.Constants.validPercentage);
                    }
                } else if (val == '000' || val > 99.99) {
                    ngModelCtrl.$setViewValue('');
                    ngModelCtrl.$render();
                    $rootScope.setMsg($rootScope.Constants.validPercentage);
                    return '';
                } else {
                    var pos = val.indexOf('.');
                    if (pos == 0 && val.length > 3) {
                        ngModelCtrl.$setViewValue(val.substring(0, 3));
                        ngModelCtrl.$render();
                        return val.substring(0, 3);
                        $rootScope.setMsg($rootScope.Constants.validPercentage);
                    } else if (pos == 1 && val.length > 4) {
                        ngModelCtrl.$setViewValue(val.substring(0, 4));
                        ngModelCtrl.$render();
                        return val.substring(0, 4);
                    } else if (pos == -1 && val.length > 2) {
                        ngModelCtrl.$setViewValue(val.substring(0, 2));
                        ngModelCtrl.$render();
                        return val.substring(0, 2);
                    }
                    else if (pos == 0 && val.length > 1) {
                        val = '00' + val;
                        ngModelCtrl.$setViewValue(val);
                        ngModelCtrl.$render();
                    } else if (pos == 1 && val.length > 1) {
                        val = '0' + val;
                        ngModelCtrl.$setViewValue(val);
                        ngModelCtrl.$render();
                    } else if (pos == 2 && val.length > 1) {
                        return val;
                    }
                }
                return val;
            });

            element.bind('keypress', function (event) {
                if (event.keyCode === 32) {
                    event.preventDefault();
                }
            });
        }
    };
});

genesisApp.directive('isPercentageThreeDigit', function ($rootScope) {
    return {
        require: '?ngModel',
        link: function (scope, element, attrs, ngModelCtrl) {
            if (!ngModelCtrl) {
                return;
            }

            ngModelCtrl.$parsers.push(function (val) {

                var re = /^[\d]*\.?\d*$/;

                if (val != '' && !re.test(val)) {
                    if (val != undefined && val.length > 0) {
                        ngModelCtrl.$setViewValue('');
                        ngModelCtrl.$render();
                        $rootScope.setMsg($rootScope.Constants.validPercentage);
                    }
                } else if (val == '000' || val > 100) {
                    ngModelCtrl.$setViewValue('');
                    ngModelCtrl.$render();
                    $rootScope.setMsg($rootScope.Constants.validPercentage);
                    return '';
                }
                return val;
            });

            element.bind('keypress', function (event) {
                if (event.keyCode === 32) {
                    event.preventDefault();
                }
            });
        }
    };
});

genesisApp.directive('validEmail', function ($rootScope) {
    return {
        require: '?ngModel',
        link: function (scope, element, attrs, ngModelCtrl) {
            element.bind('blur', function (event) {
                angular.element(element).removeClass('directiveError');
                var val = element.val();
                var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                if (!re.test(val)) {
                    angular.element(element).addClass('directiveError');
                    $rootScope.setMsg($rootScope.Constants.email);
                    ngModelCtrl.$render();
                }
            });
        }
    };
});

genesisApp.directive('maxminLength', function ($rootScope) {
    return {
        require: 'ngModel',
        link: function (scope, element, attrs, ngModelCtrl) {
            element.bind('blur', function (event) {
                var text = element.val();
                angular.element(element).removeClass('directiveError');
                var maxMin = attrs.maxminLength;
                var arrMaxMin = maxMin.split(',');
                if (text.length < Number(arrMaxMin[0]) || text.length > Number(arrMaxMin[1])) {
                    angular.element(element).addClass('directiveError');
                    $rootScope.setMsg(String.format($rootScope.Constants.rangelength, arrMaxMin[0], arrMaxMin[1]));
                    ngModelCtrl.$render();
                    return '';
                }
                return text;
            });
        }
    };
});