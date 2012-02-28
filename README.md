# deFunc

A simple helper for default function arguments in JavaScript. Special support for node.js-style callback(s) last function signatures.

## Simple Example

    var simple_example = deFunc(
    	["default_a", "default_b"],
    	function(a, b, fn){
    		// function body
    	});

Now, the function "simple_example" will take between 1 and 3 options. The last parameter (fn) is always the first one filled. 

For example:

    simple_example("foo");                      // yields arguments: ("default_a", "default_b", "foo")
    simple_example("test1" "foo");              // yields arguments: ("test1",     "default_b", "foo")
    simple_example("test1", "test2", "foo");    // yields arguments: ("test1",     "test2",     "foo")

    // The following throws a ReferenceError exception because the function requires a minimum of one parameter
    simple_example(); 

## More Advanced Example

Let's say you have a function that requires two callbacks and several optional parameters.

    var advanced_example = deFunc(
    	["default_a", "default_b"],
    	function(a, b, fn1, fn2){
    		// function body
    	});

This function will take between 2 and 4 options.

For example:

    advanced_example("foo", "bar");                 // yields arguments: ("default_a", "default_b", "foo", "bar")
    advanced_example("test1", "foo", "bar");        // yields arguments: ("test1",     "default_b", "foo", "bar")
    advanced_example("test1", "test2" foo","bar");  // yields arguments: ("test1",     "test2",     "foo", "bar")

    // Both the following throw ReferenceError exceptions because the function requires a minimum of two parameters
    advanced_example("test"); 
    advanced_example(); 
