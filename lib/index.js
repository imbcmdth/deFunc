function deFunc(default_values, wrappee){
	var wrappee_name = wrappee.name || 0;
	var wrappee_length = wrappee.deFunc_length || wrappee.length;
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
	_wrapped.deFunc_length = required_length;
	return _wrapped;
};

module.exports = deFunc;