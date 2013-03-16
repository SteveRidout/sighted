'use strict';

/* Controllers */

function AppCtrl($scope, $http) {
  $http({method: 'GET', url: '/api/name'}).
  success(function(data, status, headers, config) {
    $scope.name = data.name;
  }).
  error(function(data, status, headers, config) {
    $scope.name = 'Error!'
  });
}


function MapCtrl($scope, $http, Item) {
	$scope.markers = {};
  $scope.infowindow = new google.maps.InfoWindow({
    content: ""
  });
	$scope.currentLatLng = new google.maps.LatLng(40.4167754, -3.703)
    
  var mapOptions = {
  	// center: $scope.currentLatLng,
   //  zoom: 15,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };
  $scope.map = new google.maps.Map(document.getElementById("map_canvas"),
            mapOptions);
  google.maps.event.addListener($scope.map, 'click', function(event) {
    $scope.mapClicked(event);
  });

  Item.get({},function (result) {
    $scope.items = result;
    var latlngbounds = new google.maps.LatLngBounds();

    angular.forEach(result, function(item) {
      if(item.coordinates !== null && item.coordinates !== undefined ){
        try{
          $scope.showItemOnMap(latlngbounds, item, $scope.markers, $scope.infowindow, $scope.map);
        }
        catch(e){}
      }
    });
    $scope.map.fitBounds(latlngbounds);


  });

  var iconBase = 'https://maps.google.com/mapfiles/kml';
  $scope.showItemOnMap = function(latlngbounds, happening, markers, infowindow, map) {
    //$scope.myMap.setZoom(16);
    var latLng = new google.maps.LatLng(happening.coordinates[0],happening.coordinates[1]);
    latlngbounds.extend(latLng);

    var image = {
      // url: iconBase + '/paddle/grn-circle.png',
      // This marker is 20 pixels wide by 32 pixels tall.
      //size: new google.maps.Size(20, 32),
      // The origin for this image is 0,0.
      //origin: new google.maps.Point(0,0),
      // The anchor for this image is the base of the flagpole at 0,32.
      //anchor: new google.maps.Point(0, 32)
      scaledSize: new google.maps.Size(30,30)
    };

    if(happening.category === "status"){
      image.url = iconBase + '/paddle/red-circle.png'
    }
    else{
      image.url = iconBase + '/paddle/grn-circle.png'      
    }


    var newMarker = new google.maps.Marker({
      map: map,
      position: latLng,
      title: happening.title,
      icon: image
      // shadow: iconBase + 'schools_maps.shadow.png'
    });

    google.maps.event.addListener(newMarker, 'mouseover', function() {
      var infoHtml = "<a href='" + happening.ng_url +"'>" + happening.title + "</a>";
      infowindow.content = infoHtml;
      infowindow.open(map,newMarker);
    });
    markers[happening._id] = newMarker;
  };

}



function MyCtrl1() {}
MyCtrl1.$inject = [];


function MyCtrl2() {
}
MyCtrl2.$inject = [];
