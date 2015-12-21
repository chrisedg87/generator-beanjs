'use strict';

//Setting up route
angular.module('<%= slugifiedPluralName %>').config(['$routeProvider',
	function($routeProvider) {
		// <%= humanizedPluralName %> state routing
		$stateProvider.
		when('list<%= classifiedPluralName %>', {
			templateUrl: 'modules/<%= slugifiedPluralName %>/views/list-<%= slugifiedPluralName %>.client.view.html'
		}).
		when('create<%= classifiedSingularName %>', {
			templateUrl: 'modules/<%= slugifiedPluralName %>/views/create-<%= slugifiedSingularName %>.client.view.html'
		}).
		when('view<%= classifiedSingularName %>', {
			templateUrl: 'modules/<%= slugifiedPluralName %>/views/view-<%= slugifiedSingularName %>.client.view.html'
		}).
		when('edit<%= classifiedSingularName %>', {
			templateUrl: 'modules/<%= slugifiedPluralName %>/views/edit-<%= slugifiedSingularName %>.client.view.html'
		});
	}
]);