app.controller('searchController', 	function ($scope, $location, $http, $resource) {

	//$scope.locations = ["Leeds", "Liverpool", "Manchester", "Warrington"];
	
	$scope.locationJson = 'json/locations.json';
	
	$http.get($scope.locationJson).success(function(locationData) {
		$scope.locations = locationData.countries;
		console.log ($scope.locations);
	}).error(function(data, status, headers, config) {
	console.log('error');
	}); 

	$scope.searchClick = function() {
		if($scope.locationSelect2){
			$location.path('/results/' + $scope.locationSelect2);
		} else {
			$scope.errorMessage = 'Please select a location';
		}
	}
});

app.controller('resultsController', 	function ($scope, $http, $resource, $filter, $location, $routeParams) {

	$scope.results = [];
	$scope.theLocation = $routeParams.location;
	 $scope.priceRange = [0,100];
	
	if($scope.theLocation === 'Liverpool') {
		var map = L.map('map').setView([53.408371, -2.991573], 14);
		$scope.theJson = 'json/carhire-liverpool.json';
	}
	if($scope.theLocation === 'Manchester') {
		var map = L.map('map').setView([53.479251, -2.247926], 14);
		$scope.theJson = 'json/carhire-manchester.json';
	}
	if($scope.theLocation === 'Warrington') {
			var map = L.map('map').setView([53.390044, -2.596950], 14);
			$scope.theJson = 'json/carhire-warrington.json';
	}
	if($scope.theLocation === 'Leeds') {
		var map = L.map('map').setView([53.801279, -1.548567], 14);
		$scope.theJson = 'json/carhire-leeds.json';
	}

	L.tileLayer('http://{s}.tile.cloudmade.com/84e0e180667d43fe8cd72f18dcbfe3bd/997/256/{z}/{x}/{y}.png', {
		attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery &copy; <a href="http://cloudmade.com">CloudMade</a>',
		maxZoom: 18
	}).addTo(map);


		$http.get($scope.theJson).success(function(data) {
			$scope.results = data.results;
			$scope.createMapMarkers();
		}).error(function(data, status, headers, config) {
		console.log('error');
	  });  
	  
	$scope.createMapMarkers = function () {
		$scope.providers = L.layerGroup();
		angular.forEach($scope.results, function(theResult) {
			$scope.providers.addLayer(L.marker([theResult.company.location.latitude, theResult.company.location.longitude]).bindPopup('<img src="'+theResult.company.image+'" />'));
		});
		$scope.providers.addTo(map);
	}	 


    $scope.currentPage = 0, $scope.pageSize = 10;
	$scope.numberOfPages = function(){
        return Math.ceil($scope.results.length/$scope.pageSize);                
    }	 
	  
	$scope.filterCarType = function(item) {
		$scope.checkedCarTypes = [];
		if($scope.carType) {
			if($scope.carType.Mini) $scope.checkedCarTypes.push('Mini');
			if($scope.carType.Economy) $scope.checkedCarTypes.push('Economy');
			if($scope.carType.Compact) $scope.checkedCarTypes.push('Compact');
			if($scope.carType.Intermediate) $scope.checkedCarTypes.push('Intermediate');
			if($scope.carType.Premium) $scope.checkedCarTypes.push('Premium');
		}
		for (var i in $scope.checkedCarTypes) {
			if (item.carType.name === $scope.checkedCarTypes[i]) {
				return true;
			}
		}
		if($scope.checkedCarTypes.length === 0) return true;
	}

	$scope.filterProvider = function(item) {
		$scope.checkedProviders = [];
		if($scope.company) {
			if($scope.company.AtlasChoice) $scope.checkedProviders.push('Atlas Choice');
			if($scope.company.HolidayAutos) $scope.checkedProviders.push('Holiday Autos');	
			if($scope.company.Avis) $scope.checkedProviders.push('Avis');
			if($scope.company.Budget) $scope.checkedProviders.push('Budget');
		}
		for (var i in $scope.checkedProviders) {
			if (item.company.name === $scope.checkedProviders[i]) {
				return true;
			}
		}
		if($scope.checkedProviders.length === 0) return true;
	}
	
	$scope.filterPrice = function(item) {
		if(item.price.value > $scope.priceRange[0] && item.price.value < $scope.priceRange[1]) return true;
		//console.log(item.price.value);
		//return true;
	}
	
	$scope.updateMarkers = function() {
		$scope.providers.clearLayers();
		angular.forEach($scope.filteredItems, function(theResult) {
			$scope.providers.addLayer(L.marker([theResult.company.location.latitude, theResult.company.location.longitude]).bindPopup('<img src="'+theResult.company.image+'" />'));
		});
		$scope.providers.addTo(map);
		$scope.numberOfPages=function(){
			return Math.ceil($scope.filteredItems.length/$scope.pageSize);                
		}			
	}

}); // </ carHireController > 