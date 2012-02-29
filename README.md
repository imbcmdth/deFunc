# deFunc

A simple helper for default function parameters in JavaScript.

    wrapped:Function = deFunc(defaults:Array, wrappee:Function);

If the arity of the function is greater than the number of parameters in the *defaults* array, then the remaining parameters to the function are *required*. The required parameters are always placed at the end of the functions (right after the defaults) in order to support the "callback(s)-last" functions that node.js encourages.

The point of **deFunc()** is to remove the parameter-swizzling preamble which functions are required to employ when they accept several optional parameters along with a required *callback* or *next* function as their final parameter.

## Simple Example

    var simple_example = deFunc(
    	["default_a", "default_b"],
    	function(a, b, fn){
    		// function body
    	});

Now, the function "simple_example" will take between 1 and 3 options. The last parameter (fn) is always the last argument provided.

For example:

    simple_example("foo");                      // yields arguments: ("default_a", "default_b", "foo")
    simple_example("test1" "foo");              // yields arguments: ("test1",     "default_b", "foo")
    simple_example("test1", "test2", "foo");    // yields arguments: ("test1",     "test2",     "foo")
    
    // The following throws a ReferenceError exception because the function requires a minimum of one parameter
    simple_example(); 

## Another Example

Let's say you have a function that requires *two* callbacks and takes several optional parameters.

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
    advanced_example("oops"); 
    advanced_example(); 

## Advanced Example

You can use **deFunc()** to do *partial function application* where we generate functions with "baked-in" parameters. The benefit of using **deFunc()** is that we can still override previously set parameters.

    var copy_from_to = function(source, destination, filename){
    	// Do copy
    };
    
    // Bake-in a source for our "copy" function
    var source_preset = deFunc(
    	["/from/here/"],
    	copy_from_to);
    
    source_preset("/to/here/", "a_file");           // yields arguments: ("/from/here/", "/to/here/", "a_file")

    var source_and_destination_preset = deFunc(
    	["/to/here/"],
    	source_preset);

    source_and_destination_preset("another_file");  // yields arguments: ("/from/here/", "/to/here/", "another_file")

By passing in more parameters we can still override the baked-in parameters:

    source_and_destination_preset("/overridden/dest/", "yet_another_file"); 
        // yields arguments: ("/from/here/", "/overridden/dest/", "yet_another_file")

    source_and_destination_preset("/overridden/source/", "/overridden/dest/", "one_more_file"); 
        // yields arguments: ("/overridden/source/", "/overridden/dest/", "one_more_file")

The way we define our *partial functions* using **deFunc()** determines the override-order. The "chaining" method used above means that we override from right-to-left. If we defined both our *source* and *destination* arguments at once, we would override them from left-to-right:

    var source_and_destination_preset2 = deFunc(
    	["/from/here/", "/to/here/"],
    	copy_from_to);

Which results in the following when we override the baked-in parameters:

    source_and_destination_preset2("another_file");
        // yields arguments: ("/from/here/", "/to/here/", "another_file")

    source_and_destination_preset2("/overridden/source/", "yet_another_file");
        // yields arguments: ("/overridden/source/", "/to/here/", "yet_another_file")

    source_and_destination_preset2("/overridden/source/", "/overridden/dest/", "one_more_file");
        // yields arguments: ("/overridden/source/", "/overridden/dest/", "one_more_file")
