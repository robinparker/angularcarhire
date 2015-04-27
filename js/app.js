'use strict';
var app = angular.module('carHire101', ['ngResource', 'ui']).
	config(function($routeProvider) {
		$routeProvider.
			when('/results/:location', {templateUrl:'views/results.html', controller:'resultsController'}).
			when('/search', {templateUrl:'views/search.html', controller:'searchController'}).
			otherwise({redirectTo:'/', templateUrl:'views/search.html', controller:'searchController'});
	});


app.filter('startFrom', function() {
    return function(input, start) {
        start = +start; //parse to int
        return input.slice(start);
    }
});


app.directive('uiSlider',['ui.config', function(uiConfig) {
    'use strict';
    uiConfig.uiSlider = uiConfig.uiSlider || {}; 
    return {
            restrict: 'A',
            scope: {
                values: '=ngModel',
            },
            link:function(scope,elm,$attrs,uiEvent ) {
            
             var expression,
             options = {
               range: true,
               values: scope.values,
               slide: function(event,ui){
                 scope.$apply(function(){
                   scope.values[0] = ui.values[0];
                   scope.values[1] = ui.values[1];
                 });
               }
             };
             if ($attrs.uiSlider) {
              expression = scope.$eval($attrs.uiSlider);
            } else {
              expression = {};
            }
            
             //Set the options from the directive's configuration
            angular.extend(options, uiConfig.devCalendar, expression);
            //console.log(options);
            elm.slider(options);
            }
        };
       }]);
	

app.directive('autoComplete', function($timeout) {
    return function(scope, iElement, iAttrs) {
            iElement.autocomplete({
                source: scope[iAttrs.uiItems],
                select: function() {
                    $timeout(function() {
                      iElement.trigger('input');
                    }, 0);
                }
            });
    };
});