(function(){
	// oldeFunc is DEPRECATED and will be removed soon
	function oldeFunc(default_values, wrappee){
		var wrappee_name = wrappee.name || 0;
		var wrappee_length = wrappee.required || wrappee.length;
		var default_length = default_values.length;
		var required_length = wrappee_length - default_length;
		var function_length = Math.max(1, wrappee_length - default_length);
		if(typeof default_values === "undefined" || !"slice" in default_values)
			throw new ReferenceError("First argument to deFunc must be an array.");
		if(typeof wrappee !== "function" )
			throw new ReferenceError("Second argument to deFunc must be a function.");
		if(required_length < 0)
			throw new ReferenceError('Function passed to deFunc must have an arity greater or equal to the number of defaults.');
		var _wrapped = function() {
			var args = Array.prototype.slice.call(arguments);
			var args_length = args.length;
			var optional_count = Math.max(0, args_length - function_length);
			var function_count = Math.max(0, args_length - optional_count);
			var default_count = wrappee_length - optional_count - function_count;
			if(required_length > args_length) {
				if(wrappee_name === 0)
					throw new ReferenceError('Anonymous function requires at least ' + required_length + ' parameter(s).');
				else
					throw new ReferenceError('Function "' + wrappee_name + '" requires at least ' + required_length + ' parameter(s).');
			}
			var new_args = args.slice(0, optional_count).concat(
				default_values.slice(optional_count, optional_count + default_count).concat(
					args.slice(optional_count)
				)
			);
			wrappee.apply(this, new_args);
		};
		_wrapped.required = required_length;
		return _wrapped;
	}

	function deFunc(A, B, C){
		/* Call old-style deFunc for backwards compatibility */
		if(typeof C === "undefined" && typeof B === "function")
			return oldeFunc(A, B);

		var wrappee = A;
		var default_offset = B;
		var default_values = C;
		var wrappee_length = wrappee._deFunc_length || wrappee.length;
		var default_length = default_values.length;
		var required_length = wrappee_length - default_length;

		if(typeof default_values === "undefined" || !"slice" in default_values)
			throw new ReferenceError("Third argument to deFunc must be an array.");
		if(typeof default_offset !== "number")
			throw new ReferenceError("Second argument to deFunc must be a number.");
		if(typeof wrappee !== "function" )
			throw new ReferenceError("First argument to deFunc must be a function.");
		if(required_length - default_offset < 0)
			throw new Error('Function has an arity equal to ' + wrappee_length + 
				' but you used ' + (default_length + default_offset) + ' parameters.');

		var _wrapped_wrappee = function() {
			var args = Array.prototype.slice.call(arguments);
			var args_length = args.length;
			if(required_length > args_length)
				throw new ReferenceError('Function requires at least ' + required_length + ' parameter(s).');
			var optional_count = Math.max(0, args_length - required_length);
			var function_count = Math.max(0, args_length - optional_count);
			var default_count = wrappee_length - optional_count - function_count;
			var new_args = args.slice(0, default_offset + optional_count).concat(
				default_values.slice(optional_count, optional_count + default_count).concat(
					args.slice(default_offset + optional_count)
				)
			);
			wrappee.apply(this, new_args);
		};
		_wrapped_wrappee._deFunc_length = required_length;
		return _wrapped_wrappee;
	}

	if(typeof module !== "undefined" && "exports" in module)
		module.exports = deFunc;
	else
		window['deFunc'] = deFunc;
}());