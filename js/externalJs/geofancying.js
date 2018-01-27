var polygon_coord ="";
var method_name ="add"
var globallat=20.593684;
var globallng= 78.96288;

var mydatatest=$('#radius').val();
$(document).ready(function() {
	$("body").on("click focus", '.form_time', function() {
		$(this).datetimepicker({
			format: 'LT'
		});
	});
	//Checkbox Check 

	$('body').on('change', '.checkDays', function() {
		if ($(this).is(':checked')) {
			$(this).closest('tr').find('input[type="text"]').prop('disabled', false);
			$(this).closest('tr').find('.form_time').datetimepicker({
				format: 'LT'
			});
		} else {
			$(this).closest('tr').find('input[type="text"]').prop('disabled', true);
		}
	});
	$('body').on('click', '.add-icon', function() {
		var data_day = 0;
		if ($(this).parents('.root').find('input[type="checkbox"]').is(':checked')) {
			var total_rows = 0
			var row_append = true;
			$(this).parents('.root').find('.rootInner').each(function(key, value) {
				if (total_rows == 0) {
					
					data_day = $(this).attr('data-day');
				}
				if ($.trim($(this).find('.opening_time').val()) == "" || $.trim($(this).find('.closing_time').val()) == "") {
					row_append = false;
				}
				total_rows++;
			});
			if (total_rows < 2 && row_append == true) {
				$(this).closest('tbody').append('<tr class="rootInner">' + $(this).parents('.rootInner')
				.html() + '</tr>');
			}
		}
		$(this).parents('.root').find('.rootInner').each(function(key, value) {
			if (key > 0) {
				$(this).find('.add-icon').removeClass('add-icon').addClass('remove-icon');
				$(this).find('.fa').removeClass('fa-plus').addClass('fa-minus');
				$(this).find('.opening_time').attr('name', 'rtiming['+data_day+'][opening_hours][evening]');
				$(this).find('.closing_time').attr('name', 'rtiming['+data_day+'][closing_hours][evening]');
			}
		});

	});
	$('body').on('click', '.remove-icon', function() {
		$(this).closest('tr').remove();
	});
});

//google.maps.event.addDomListener(window, 'load', init);
var map1, markersArray = [];

function addMarker(lat, lng) {
	globallat=lat;
	globallng=lng;
  var myLatlng = {lat: lat, lng: lng};
  
//   var map1 = new google.maps.Map(document.getElementById('mapkit-2911'), {
	var map1 = new google.maps.Map(document.getElementById('map'), {
    zoom: 18,
    center: myLatlng
  });

  var marker = new google.maps.Marker({
    position: myLatlng,
    map: map1,
    title: 'Click to zoom'
  });

  map1.addListener('center_changed', function() {
    // 3 seconds after the center of the map has changed, pan back to the
    // marker.
    window.setTimeout(function() {
      map1.panTo(marker.getPosition());
    }, 3000);
  });

  marker.addListener('click', function() {
    map1.setZoom(8);
    map1.setCenter(marker.getPosition());
  });
  initMap();
}
$(document).on('blur','.locationSearch', function(e) {
	var address_value = "";
	$('.address_field').each(function() {
		address_value += $(this).val()+" ";
	});
	bindMapAndsetLocation(address_value);
});

$(document).on('click','.btnSearchLocation', function(e) {
	
	var address_value = "";
	
	$('.address_field').each(function() {
		address_value += $(this).val()+" ";
	});
	bindMapAndsetLocation(address_value);
	
});



function bindMapAndsetLocation(address_value){
	
	$.ajax({
		url: "https://maps.googleapis.com/maps/api/geocode/json?address="+address_value+"&key=AIzaSyCyWoAibRItIGdGMHjolWUyl-58EC4WIsQ", 
		success: function(result){
			if (result.results.length !== 0) {
				$('#radius').val(result.results[0].geometry.location.lat+','+result.results[0].geometry.location.lng);
				$('#latitude').val(result.results[0].geometry.location.lat);
				$('#longitude').val(result.results[0].geometry.location.lng);
				addMarker(result.results[0].geometry.location.lat, result.results[0].geometry.location.lng);
				moveToLocation(result.results[0].geometry.location.lat, result.results[0].geometry.location.lng);
			
			}else if($('#radius').val()!=""){
				
				var cor=$('#radius').val().split('~')[0];
				addMarker(parseFloat(cor.split(',')[0]), parseFloat(cor.split(',')[1]));
				moveToLocation(parseFloat(cor.split(',')[0]), parseFloat(cor.split(',')[1]));
				$('#latitude').val('');
				$('#longitude').val('');
			}
			 else {
				$('#radius').val('');
				$('#latitude').val('');
				$('#longitude').val('');
			}
		}
	});
}
function callmapApi(){
	
	$.ajax({
		url: "https://maps.googleapis.com/maps/api/geocode/json?address=''&key=AIzaSyAPGIvYpvs7ETQHWcfHnJjLBLH5XNF0OZs", 
		success: function(result){
			
			if (result.results.length !== 0) {
				$('#latitude').val(result.results[0].geometry.location.lat);
				$('#longitude').val(result.results[0].geometry.location.lng);
				addMarker(result.results[0].geometry.location.lat, result.results[0].geometry.location.lng);
				moveToLocation(result.results[0].geometry.location.lat, result.results[0].geometry.location.lng);
			} else {
				$('#latitude').val('');
				$('#longitude').val('');
			}
		}
	});
}

function moveToLocation(lat, lng){
    var centerofmap = new google.maps.LatLng(lat, lng);
    // using global variable:
    map.panTo(centerofmap);
}


$(document).ready(function() {
	var count = 0;
	document.addEventListener('change', function(e) {
		var ele = e.target;
		if ($(e.target).is('input.rest_img[type="file"]') || $(e.target).is('input.rest_logo[type="file"]')) {
			var files = e.target.files;
			for (var i = 0; i < files.length; i++) {
				var file = files[i];
				if (file.type.match('image')) {
					var picreader = new FileReader();
					picreader.addEventListener("load", function(event) {
						var picture = event.target;
						if ($(e.target).is('input.rest_img[type="file"]')) {
							showPreview(picture.result, ele, 5);
							
						} else {
							showPreview(picture.result, ele, 1);
						}
					});
					picreader.readAsDataURL(file);
				}
			}
		} else {
			console.log('not file');
		}
	}, true);
	var count = 1;

	function showPreview(pic, ele, count) {
		ele.previousElementSibling.src = pic;
		ele.setAttribute('style', 'display:none;');
		ele.nextElementSibling.setAttribute('style', 'display:block;');
		ele.closest('li').classList.remove('add');
		if ($('.uploadBtnRestImage').length < count) {
			$('.gallery').append(
				' <li class="uploadBtn uploadBtnRestImage add"><img class="img" src><input type="file" name="rest_image[]" class="rest_img" accept="image/*"><a href="javascript:void(0);" class="removePic removePicRestImage">X</a></li>'
			);
			count = 1;
		} else {
			return false;
		}
	}
	
	$('body').on('click', '.removePicRestImage', function() {
		$(this).parents('.uploadBtnRestImage').remove();
		if ($('.uploadBtnRestImage.add').length) {
			return false;
		} else {
			$('.gallery').append(
				' <li class="uploadBtnRestImage uploadBtn add"><img class="img" src><input type="file" class="rest_img" name="rest_image[]" accept="image/*"><a href="javascript:void(0);" class="removePic removePicRestImage">X</a></li>'
			);
		}
	});
	
	$('body').on('click', '.removePicLogo', function() {
		$(this).parents('.uploadBtnLogo').remove();
		if ($('.uploadBtnLogo.add').length) {
			return false;
		} else {
			$('.galleryLogo').append(
				' <li class="uploadBtnLogo uploadBtn add"><img class="img" src><input type="file" class="rest_logo" name="rest_logo" accept="image/*"><a href="javascript:void(0);" class="removePic removePicLogo">X</a></li>'
			);
		}
	});

	/*** File Upload ***/

	$(document).on('click', '.browse', function() {
		var file = $(this).parent().parent().parent().find('.file');
		file.trigger('click');
	});
	$(document).on('change', '.file', function() {
		$(this).parent().find('.form-control').val($(this).val().replace(/C:\\fakepath\\/i, ''));
	});


	/*
	Tab container Scripts
	*/

	$('.formTab a').click(function() {
		$('.formTab a').removeClass('active');
		$('.formPane').removeClass('in');
		$(this).addClass('active');
		var _target = $(this).attr('data-id');
		$(_target).addClass('in');
	})
});

var edit_validation = "";


//Below is the code for geo fence


var all_overlays ='';
var drawingManager;
var selectedShape;
var map;
var newShape;
function setSelection(shape) {
  selectedShape = shape;
  shape.setEditable(true);
  //selectColor(shape.get('fillColor') || shape.get('strokeColor'));
}
function initMap() {
	
	if($('#radius').val()!="")
	{
		var mycoordinate=$('#radius').val().split('~')[0];
		globallat=parseFloat(mycoordinate.split(',')[0]);
		globallng=parseFloat(mycoordinate.split(',')[1]);
	}
	
	var mapOptions1 = {
		center: new google.maps.LatLng(globallat,globallng),
		zoom: 18,
		mapTypeId: google.maps.MapTypeId.ROADMAP
	}
	//var mapElement1 = document.getElementById('mapkit-2911');
	var mapElement1 = document.getElementById('map');
	var map1 = new google.maps.Map(mapElement1, mapOptions1);
	
	
	map = new google.maps.Map(document.getElementById('map'), {
		center: {lat: globallat, lng: globallng},
		zoom: 18
	});
	
	if($('#hdnvendorId').val()!="" && $('input[name=vendorLocation]').val()=="")
	{
		
		method_name="edit";
		var temp_coord = [];
		var geofenceCoordinates=$('#radius').val().split('~');
		$.each(geofenceCoordinates, function(key, value){
			var temp_data = {};
			temp_data.lat = parseFloat(value.split(',')[0]);
			temp_data.lng = parseFloat(value.split(',')[1]);
			temp_coord.push(temp_data);
		});
	}
	if (polygon_coord != "") {
		var temp_coord = [];
		$.each(JSON.parse(polygon_coord), function(key, value){
			var temp_data = {};
			temp_data.lat = parseFloat(value.lat);
			temp_data.lng = parseFloat(value.lng);
			temp_coord.push(temp_data);
		});
	}
	
	if (method_name == "edit" && $('input[name=vendorLocation]').val()=="") {
		drawingManager = new google.maps.Polygon({
			paths: temp_coord,
			strokeColor: '#FF0000',
			strokeOpacity: 0.8,
			strokeWeight: 2,
			fillColor: '#FF0000',
			fillOpacity: 0.35,
			editable:true
		});
		newShape = drawingManager;
		newShape.type = "polygon";
		setSelection(newShape);
		google.maps.event.addListener(newShape.getPath(), 'set_at', function() {
			
			var htmlStr = "";
			for (var i = 0; i < newShape.getPath().getLength(); i++) {
				if (htmlStr == "") {
					htmlStr += newShape.getPath().getAt(i).toUrlValue(5);
				} else {
					htmlStr += "~"+newShape.getPath().getAt(i).toUrlValue(5);
				}
				$('#radius').val(htmlStr);
			}
		});

		google.maps.event.addListener(newShape.getPath(), 'insert_at', function() {
			
			var htmlStr = "";
			for (var i = 0; i < newShape.getPath().getLength(); i++) {
				if (htmlStr == "") {
					htmlStr += newShape.getPath().getAt(i).toUrlValue(5);
				} else {
					htmlStr += "~"+newShape.getPath().getAt(i).toUrlValue(5);
				}
				$('#radius').val(htmlStr);
			}
		});
		
	} else {
		drawingManager = new google.maps.drawing.DrawingManager({
			drawingMode: google.maps.drawing.OverlayType.POLYGON,
			drawingControl: false,
			drawingControlOptions: {
			  position: google.maps.ControlPosition.TOP_CENTER,
			  drawingModes: ['polygon']
			}
		});
		google.maps.event.addListener(drawingManager, 'overlaycomplete', function(e) {
			all_overlays = e;
			var htmlStr = "";
			for (var i = 0; i < e.overlay.getPath().getLength(); i++) {
				if (htmlStr == "") {
					htmlStr += e.overlay.getPath().getAt(i).toUrlValue(5);
				} else {
					htmlStr += "~"+e.overlay.getPath().getAt(i).toUrlValue(5);
				}
			}
			
			$('#radius').val(htmlStr);
			drawingManager.setDrawingMode(null);
			newShape = e.overlay;
			newShape.type = e.type;
			setSelection(newShape);
			google.maps.event.addListener(newShape.getPath(), 'set_at', function() {
				
				var htmlStr = "";
				for (var i = 0; i < newShape.getPath().getLength(); i++) {
					if (htmlStr == "") {
						htmlStr += newShape.getPath().getAt(i).toUrlValue(5);
					} else {
						htmlStr += "~"+newShape.getPath().getAt(i).toUrlValue(5);
					}
					$('#radius').val(htmlStr);
				}
			});

			google.maps.event.addListener(newShape.getPath(), 'insert_at', function() {
				var htmlStr = "";
				for (var i = 0; i < newShape.getPath().getLength(); i++) {
					if (htmlStr == "") {
						htmlStr += newShape.getPath().getAt(i).toUrlValue(5);
					} else {
						htmlStr += "~"+newShape.getPath().getAt(i).toUrlValue(5);
					}
					$('#radius').val(htmlStr);
				}
			});
		});	
	}
	drawingManager.setMap(map);
}

function open_geo_fence_map() {
	
	google.maps.event.trigger(map, "resize");
}

$('#rest_delivery_area').on('shown.bs.modal', function () {
    google.maps.event.trigger(map, "resize");
});

function reset_map() {
	if (selectedShape) {
		selectedShape.setMap(null);
		drawingManager = new google.maps.drawing.DrawingManager({
			drawingMode: google.maps.drawing.OverlayType.POLYGON,
			drawingControl: false,
			drawingControlOptions: {
			  position: google.maps.ControlPosition.TOP_CENTER,
			  drawingModes: ['polygon']
			}
		});
		google.maps.event.addListener(drawingManager, 'overlaycomplete', function(e) {
			all_overlays = e;
			var htmlStr = "";
			for (var i = 0; i < e.overlay.getPath().getLength(); i++) {
				if (htmlStr == "") {
					htmlStr += e.overlay.getPath().getAt(i).toUrlValue(5);
				} else {
					htmlStr += "~"+e.overlay.getPath().getAt(i).toUrlValue(5);
				}
			}
			$('#radius').val(htmlStr);
			drawingManager.setDrawingMode(null);
			newShape = e.overlay;
			newShape.type = e.type;
			setSelection(newShape);
			google.maps.event.addListener(newShape.getPath(), 'set_at', function() {
				
				var htmlStr = "";
				for (var i = 0; i < newShape.getPath().getLength(); i++) {
					if (htmlStr == "") {
						htmlStr += newShape.getPath().getAt(i).toUrlValue(5);
					} else {
						htmlStr += "~"+newShape.getPath().getAt(i).toUrlValue(5);
					}
					$('#radius').val(htmlStr);
				}
			});

			google.maps.event.addListener(newShape.getPath(), 'insert_at', function() {
				
				var htmlStr = "";
				for (var i = 0; i < newShape.getPath().getLength(); i++) {
					if (htmlStr == "") {
						htmlStr += newShape.getPath().getAt(i).toUrlValue(5);
					} else {
						htmlStr += "~"+newShape.getPath().getAt(i).toUrlValue(5);
					}
					$('#radius').val(htmlStr);
				}
			});
		});	
		drawingManager.setMap(map);
		$('#radius').val('');
	}
}

function UpdateQueryString(key, value, url) {
    if (!url) url = window.location.href;
    var re = new RegExp("([?&])" + key + "=.*?(&|#|$)(.*)", "gi"),
        hash;

    if (re.test(url)) {
        if (typeof value !== 'undefined' && value !== null)
            return url.replace(re, '$1' + key + "=" + value + '$2$3');
        else {
            hash = url.split('#');
            url = hash[0].replace(re, '$1$3').replace(/(&|\?)$/, '');
            if (typeof hash[1] !== 'undefined' && hash[1] !== null) 
                url += '#' + hash[1];
            return url;
        }
    } else {
        if (typeof value !== 'undefined' && value !== null) {
            var separator = url.indexOf('?') !== -1 ? '&' : '?';
            hash = url.split('#');
            url = hash[0] + separator + key + '=' + value;
            if (typeof hash[1] !== 'undefined' && hash[1] !== null) 
                url += '#' + hash[1];
            return url;
        }
        else
            return url;
    }
}

$('.type_restaurant').on('change', function() {
	
	if($(this).val() == '') {
		var value = null;
	} else {
		var value = $(this).val();
	}	
	var url = UpdateQueryString('type', value, window.location.href);
	window.location.href = url;
});

$('.res_status_toggle').on('click', function() {
	var method = $(this).data('method');
	
	if (confirm("Are you sure to "+method+" this cuisine")) {
		var id = $(this).data('id');
		$('.loader-wrap').show();
		$.ajax({
			method: "GET",
			url: base_url+"admin/restaurant/status_toggle",
			data: {'method': method, 'id':id},
			dataType: 'json',
			success: function (data) {
				$('.loader-wrap').hide();
				if (data.code == 200) {
					window.location.href = window.location.href;
				} else {
					alert('Failed to update page status!');
				}
			}
		});
	}
});

$('.address_field').trigger('blur');
callmapApi();

