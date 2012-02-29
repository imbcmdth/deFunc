# deFunc

A simple helper for default function parameters in JavaScript.

    wrapped:Function = deFunc(defaults:Array, wrappee:Function);

If the arity of the *wrappee* is greater than the number of parameters in the *defaults* array, then the remaining parameters to the *wrappee* are **required**. The required parameters are always placed at the end of the functions (starting right after the *defaults*) in order to support the "callback(s)-last" functions that node.js encourages.

The point of **deFunc()** is to remove the parameter-swizzling preamble which functions are required to employ when they accept several optional parameters along with a required *callback* or *next* function as their final parameter.

## Simple Example

    var example1 = deFunc(
    	["default_a", "default_b"],
    	function(a, b, fn){
    		// function body
    	});

Now, the function "simple_example" will take between 1 and 3 options. The last parameter (in this case fn) is always the last argument provided.

For example:

    example1("foo");                      // yields arguments: ("default_a", "default_b", "foo")
    example1("test1" "foo");              // yields arguments: ("test1",     "default_b", "foo")
    example1("test1", "test2", "foo");    // yields arguments: ("test1",     "test2",     "foo")
    
    // The following throws a ReferenceError exception because the function requires a minimum of one parameter
    simple_example(); 

## Another Example

Let's say you have a function that requires *two* callbacks but also accepts several optional parameters.

    var example2 = deFunc(
    	["default_a", "default_b"],
    	function(a, b, fn1, fn2){
    		// function body
    	});

The result (example2) will now accept between 2 and 4 options.

For example:

    example2("foo", "bar");                   // yields arguments: ("default_a", "default_b", "foo", "bar")
    example2("test1", "foo", "bar");          // yields arguments: ("test1",     "default_b", "foo", "bar")
    example2("test1", "test2", "foo", "bar"); // yields arguments: ("test1",     "test2",     "foo", "bar")
    
    // Both the following throw ReferenceError exceptions because the function requires a minimum of two parameters
    example2("oops"); 
    example2(); 

## Advanced Example

You can use **deFunc()** to do [partial function application](http://en.wikipedia.org/wiki/Partial_application) where we generate functions with "baked-in" parameters. The benefit of using **deFunc()** is that we are able to easily override previously set parameters.

Let's say we had this function: 

    var copy_from_to = function(source, destination, filename){
    	// Do copy
    };

We can use **deFunc()** to apply *partial function application* to the source and destination parameters:

    var source_and_destination_preset = deFunc(
    	["/from/here/", "/to/here/"],
    	copy_from_to);

    source_and_destination_preset("another_file");
        // yields arguments: ("/from/here/", "/to/here/", "another_file")

And by passing in more parameters we can still override the default parameters:

    source_and_destination_preset("/overridden/source/", "yet_another_file");
        // yields arguments: ("/overridden/source/", "/to/here/", "yet_another_file")

    source_and_destination_preset("/overridden/source/", "/overridden/dest/", "one_more_file");
        // yields arguments: ("/overridden/source/", "/overridden/dest/", "one_more_file")

The way we define our *partial functions* using **deFunc()** determines the order that their optional parameters are overridden.

Above, we defined both our *source* and *destination* arguments at once, so the parameters are overridden from left-to-right or *source* first.

The "chaining" method, shown below, allows us to override the optional parameters from right-to-left. In the following example, that means *destination* first. 

    var source_and_destination_preset = deFunc(
    	["/to/here/"],
    	deFunc(
    		["/from/here/"],
    		copy_from_to
    	)
    );
    
    source_and_destination_preset("another_file");  // yields arguments: ("/from/here/", "/to/here/", "another_file")

And that results in the following when we override the baked-in parameters:

    source_and_destination_preset("/overridden/dest/", "yet_another_file"); 
        // yields arguments: ("/from/here/", "/overridden/dest/", "yet_another_file")

    source_and_destination_preset("/overridden/source/", "/overridden/dest/", "one_more_file"); 
        // yields arguments: ("/overridden/source/", "/overridden/dest/", "one_more_file")