/*
	deFunc - Optional parameters with default values for JavaScript functions
	Copyright (C) 2012  Jon-Carlos Rivera

	This program is free software: you can redistribute it and/or modify
	it under the terms of the GNU General Public License as published by
	the Free Software Foundation, either version 2 of the License, or
	(at your option) any later version.

	This program is distributed in the hope that it will be useful,
	but WITHOUT ANY WARRANTY; without even the implied warranty of
	MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
	GNU General Public License for more details.

	You should have received a copy of the GNU General Public License
	along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/
var vows = require('vows'),
	assert = require('assert');
	suite = vows.describe("Bring in da' Tests, bring in deFunc");
	deFunc = require('../');

// all_optional is this way to get the same strange functionality that deFunc v0.0.1 
// has by default when all parameters were optional
var all_optional = deFunc(
						deFunc(
							function(a, b, fn){
								return this.callback(null, arguments[fn()]);
							},
							0,
							["1", 2]
						),
						0,
						[function(){return 1;}]
					);

var one_required = deFunc(
						function(a, b, fn){
							return this.callback(null, arguments[fn()]);
						},
						0,
						["1", 2]
					);

var two_required = deFunc(
						function(a, b, fn){
							return this.callback(null, arguments[fn()]);
						},
						0,
						["1"]
					);

suite.addBatch({
	'All arguments optional': {
		'Nothing supplied': {
			topic: function() { all_optional.call(this); },

			'default function run': function (val) {
				assert.equal(val, 2);
			}
		},
		'One argument supplied': {
			topic: function() { all_optional.call(this, function(){return 0;}); },

			'supplied function run': function (val) {
				assert.equal(val, "1");
			}
		},
		'Two arguments supplied': {
			topic: function() { all_optional.call(this, "test1", function(){return 0;}); },

			'supplied function run': function (val) {
				assert.equal(val, "test1");
			}
		},
		'All arguments supplied': {
			topic: function() { all_optional.call(this, "test1", "test2", function(){return 1;}); },

			'supplied function run': function (val) {
				assert.equal(val, "test2");
			}
		}
	},
	'One argument required': {
		'Nothing supplied': {
			topic: true,

			'default function run': function (topic) {
				assert.throws(one_required, ReferenceError);
			}
		},
		'One argument supplied': {
			topic: function() { one_required.call(this, function(){return 0;}); },

			'supplied function run': function (val) {
				assert.equal(val, "1");
			}
		},
		'Two arguments supplied': {
			topic: function() { one_required.call(this, "test1", function(){return 0;}); },

			'supplied function run': function (val) {
				assert.equal(val, "test1");
			}
		},
		'All arguments supplied': {
			topic: function() { one_required.call(this, "test1", "test2", function(){return 1;}); },

			'supplied function run': function (val) {
				assert.equal(val, "test2");
			}
		}
	},
	'Two arguments required': {
		'Nothing supplied': {
			topic: true,

			'default function run': function (topic) {
				assert.throws(two_required, ReferenceError);
			}
		},
		'One argument supplied': {
			topic: true,

			'default function run': function (topic) {
				assert.throws(function() { two_required("test") }, ReferenceError);
			}
		},
		'Two arguments supplied - A': {
			// Since this function has two required arguments and one optional the
			// two supplied arguments are shifted to the end and the first argument is at positon 1
			topic: function() { two_required.call(this, "test1", function(){return 1;}); },

			'supplied function run': function (val) {
				assert.equal(val, "test1");
			}
		},
		'Two arguments supplied - B': {
			// Since this function has two required arguments and one optional the
			// two supplied arguments are shifted to the end and the default is at positon 0
			topic: function() { two_required.call(this, "test1", function(){return 0;}); },

			'supplied function run': function (val) {
				assert.equal(val, "1");
			}
		},
		'All arguments supplied': {
			topic: function() { two_required.call(this, "test1", "test2", function(){return 1;}); },

			'supplied function run': function (val) {
				assert.equal(val, "test2");
			}
		}
	},
}).export(module);