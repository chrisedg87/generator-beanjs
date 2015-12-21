'use strict';

/**
 * Module dependencies.
 */
var bookshelf = require('../config/db').bookshelf,
	checkit = require('checkit'),
	util = require('util');


var <%= classifiedSingularName => = bookshelf.Model.extend({
	tableName: '<% = camelizedPluralName =>',

	initialize: function() {
		this.on('saving', this.validateSave);
	},

	validateSave: function() {
		//return checkit(this.rules).run(this.attributes);
		return true;
	},

});

module.exports = <%= classifiedSingularName =>;