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
(function(){
	function makeSlice(args){ 
		return function(start, end){
			return Array.prototype.slice.call(args, start, end);
		};
	}
	function deFunc(wrappee, default_offset, default_values){
		if(typeof default_values === "undefined" 
		  || !"slice" in default_values 
		  || !"length" in default_values)
			throw new ReferenceError("Third argument to deFunc must be an array.");
		if(typeof default_offset !== "number")
			throw new ReferenceError("Second argument to deFunc must be a number.");
		if(typeof wrappee !== "function" )
			throw new ReferenceError("First argument to deFunc must be a function.");

		var wrappee_length  = wrappee._deFunc_length || wrappee.length;
		var default_length  = default_values.length;
		var required_length = wrappee_length - default_length;

		if(required_length - default_offset < 0)
			throw new Error('Function has an arity equal to ' + wrappee_length + ' but you'
			                + ' used ' + (default_length + default_offset) + ' parameters.');

		var wrapped_wrappee = function(){
			var arguments_slice  = makeSlice(arguments);
			var arguments_length = arguments.length;

			if(required_length > arguments_length)
				throw new ReferenceError('Function requires at least ' + required_length + ' parameter(s).');

			var optional_count = arguments_length - required_length;
			var default_count  = wrappee_length - optional_count - required_length;
			var new_arguments  = arguments_slice(0, default_offset + optional_count).concat(
				default_values.slice(optional_count, optional_count + default_count).concat(
					arguments_slice(default_offset + optional_count)
				)
			);

			return wrappee.apply(this, new_arguments);
		};
		// Store the new function's required arity to support nesting of deFunc
		wrapped_wrappee._deFunc_length = required_length;
		return wrapped_wrappee;
	}
	// Support for Node.js's module definition and browser inclusion via script tag
	// TODO: Support AMD
	if(typeof module !== "undefined" && "exports" in module)
		module.exports = deFunc;
	else
		window['deFunc'] = deFunc;
}());