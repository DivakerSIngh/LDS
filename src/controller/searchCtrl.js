mainApp.registerCtrl('searchCtrl', function SectorCtrl($scope, $rootScope, $http, $location, $cookies, appServices) {
debugger
$rootScope.pageClass = 'shown';
    $scope.init = function () {
        debugger
        setTimeout(() => {
            $rootScope.pageClass = 'shown';
        }, 600);
        var latlng = new google.maps.LatLng(28.5355161,77.39102649999995);
        var map = new google.maps.Map(document.getElementById('map'), {
          center: latlng,
          zoom: 13
        });
        var marker = new google.maps.Marker({
          map: map,
          position: latlng,
          draggable: true,
          anchorPoint: new google.maps.Point(0, -29)
       });
        var input = document.getElementById('searchInput');
        map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
        var geocoder = new google.maps.Geocoder();
        var autocomplete = new google.maps.places.Autocomplete(input);
        autocomplete.bindTo('bounds', map);
        var infowindow = new google.maps.InfoWindow();   
        autocomplete.addListener('place_changed', function() {
            infowindow.close();
            marker.setVisible(false);
            var place = autocomplete.getPlace();
            if (!place.geometry) {
                window.alert("Autocomplete's returned place contains no geometry");
                return;
            }
      
            // If the place has a geometry, then present it on a map.
            if (place.geometry.viewport) {
                map.fitBounds(place.geometry.viewport);
            } else {
                map.setCenter(place.geometry.location);
                map.setZoom(17);
            }
           
            marker.setPosition(place.geometry.location);
            marker.setVisible(true);          
        
            bindDataToForm(place.formatted_address,place.geometry.location.lat(),place.geometry.location.lng());
            infowindow.setContent(place.formatted_address);
            infowindow.open(map, marker);
           
        });
        // this function will work on marker move event into map 
        google.maps.event.addListener(marker, 'dragend', function() {
            geocoder.geocode({'latLng': marker.getPosition()}, function(results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
              if (results[0]) {        
                  bindDataToForm(results[0].formatted_address,marker.getPosition().lat(),marker.getPosition().lng());
                  infowindow.setContent(results[0].formatted_address);
                  infowindow.open(map, marker);
              }
            }
            });
        });
    };

    $scope.save = function () {
       
      
    };

    $scope.edit = function (request) {
        
    }

    $scope.init();


     
});

