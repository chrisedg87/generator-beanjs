'use strict';

/**
 * Module dependencies.
 */
var errorHandler = require('./errors.server.controller'),
	<%= classifiedSingularName %> = require('<%= classifiedSingularName %>'),
	_ = require('lodash');

/**
 * Create a <%= humanizedSingularName %>
 */
exports.create = function(req, res) {
	var <%= camelizedSingularName %> = new <%= classifiedSingularName %>(req.body);
	<%= camelizedSingularName %>.user = req.user;

	<%= camelizedSingularName %>.save().then(function(<%= camelizedSingularName %>) {
			res.jsonp(<%= camelizedSingularName %>);
		}).catch(function(error){
			return res.status(400).send({
				message: err
			});	
		});
	});
};

/**
 * Show the current <%= humanizedSingularName %>
 */
exports.read = function(req, res) {
	res.jsonp(req.<%= camelizedSingularName %>);
};

/**
 * Update a <%= humanizedSingularName %>
 */
exports.update = function(req, res) {

	var data = req.<%= camelizedSingularName %>.attributes;
	data = _.extend(data , req.body);

	//var article = new Article({id: data.id, title: data.title, content: data.content});
	var <%= camelizedSingularName %> = new <%= classifiedSingularName %>(data);
	<%= camelizedSingularName %>.
	save().
	then(function(model){
		res.jsonp(model);
	}).
	catch(function(err){
		return res.status(400).send({
			message: err
		});	
	});

};

/**
 * Delete an <%= humanizedSingularName %>
 */
exports.delete = function(req, res) {

	var data = req.<%= camelizedSingularName %>.attributes;

	var <%= camelizedSingularName %> = new <%= classifiedSingularName %>(data);
	<%= camelizedSingularName %>.
	destroy().
	then(function(model){
		res.json(model);
	}).
	catch(function(err){
		return res.status(400).send({
			message: err
		});	
	});

};

/**
 * List of <%= humanizedPluralName %>
 */
exports.list = function(req, res) { 
	<%= classifiedSingularName %>.
	forge().
	fetchAll().
	then(function(<%= this.camelizedPluralName =>){
		res.jsonp(<%= this.camelizedPluralName =>);
	}).
	catch(function(error){
		res.jsonp(error);
	});
};

/**
 * <%= humanizedSingularName %> middleware
 */
exports.<%= camelizedSingularName %>ByID = function(req, res, next, id) { 
	<%= classifiedSingularName %>.
	forge({id: id}).
	fetch().
	then(function(<%= this.camelizedPluralName =>){
		res.jsonp(<%= this.camelizedPluralName =>);
	}).
	catch(function(error){
		res.jsonp(error);
	});
};

