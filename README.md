# deFunc v0.0.2

A simple helper for default function parameters in JavaScript with a twist.

    wrapped:Function = deFunc(wrappee:Function, offset:Number, defaults:Array);

Where:

* **wrappee** is the function to which you want to add deFunc functionality
* **defaults** is an array of default values for the *wrappee*
* **offset** is the zero-based offset into the parameter list where the *defaults* begin

The easiest way to understand **deFunc** is by example.

## Basic Usage

The most straight-forward use for **deFunc** is as a simple default parameter filler. If you have a function:

    function foo(A, B, C);

Where all the parameters are optional but you wanted to make sure they were all set to some some reasonable defaults you would use **deFunc** like this:

    var bar = deFunc(foo, 0, ["a", "b", "c"]);

    bar();					-> foo(    "a",     "b",  "c")
    bar("new_a");			-> foo("new_a",     "b",  "c")
    bar("new_a", "new_b");	-> foo("new_a", "new_b",  "c")

And so on.

## More Basic Usage

**deFunc** does *not* require that every one of the function's parameters be set to some default. The parameters that have no default value automatically become *required* parameters.

Required parameters will throw a [ReferenceError](https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/ReferenceError) if they are not provided by the caller. With **deFunc** enforcing required parameters for you, your functions don't have to worry about getting "undefined" where it shouldn't be.

Using the same *foo* function defined above you can change the *offset* to 1 and remove the "a" element from the array. Now, the foo's first parameter, A, is required while both B and C remain optional:

    var bar = deFunc(foo, 1, ["b", "c"]);

    bar();				-> Throws a ReferenceError
    bar("a'");			-> foo("a'",      "b",  "c")
    bar("a'", "new_b");	-> foo("a'",  "new_b",  "c")

The real power of **deFunc** lies in **deFunc**'s *offset* parameter. If you change the *offset* back to 0 you can instead define parameters A and B as optional and make C the one that is required:

    var bar = deFunc(foo, 0, ["a", "b"]);

    bar();				-> Throws a ReferenceError
    bar("c'");			-> foo("a",      "b",  "c'")
    bar("new_a", "c'");	-> foo("new_a",  "b",  "c'")

## jQuery-like Usage (parameter-swizzling)

In jQuery, many functions have a signature similar to this:

    var jQuery_like = function(id, options, callback){
    	// function body
    };

Where the parameter *options* is completely optional but id and callback are both *required*. This means that the function must first check the *callback* parameter and, if it is *undefined*, then perform:

    callback = options;
    options = default_options;

This is to put the parameters back into the correct places and set *options* to some reasonable default. I call this practice *parameter-swizzling* due to the similarities such a method has in common with [array swizzling](http://en.wikipedia.org/wiki/Swizzling_%28computer_graphics%29) used in GPU programming. The problem is that this is error prone because it requires each of your functions to have a preamble that puts considerable distance between your function's definition and the real function body.

**deFunc** takes all the parameter-swizzling logic out of your functions so you can be sure that you always get *every* parameter in exactly the right locations along with default values filling in the parameters that are optional and were not provided by the caller.

In the jQuery_function example, you would use **deFunc** like this:

    var new_jQuery_like = deFunc(jQuery_like, 1, [{default:options}]);

This tells **deFunc** to take the "jQuery_like" function (which takes three parameters) and return a new function that takes two required parameters with a single optional parameter. **deFunc** takes care of the rest of the *parameter-swizzling*!

    new_jQuery_like("#id");						-> Throws a ReferenceError
    new_jQuery_like("#id", fn);					-> jQuery_like("#id", {default:options}, fn)
    new_jQuery_like("#id", {new:options}, fn);	-> jQuery_like("#id", {new:options},     fn)

## Advanced Usage

Bulding on the jQuery example above, lets say that you wanted a function where both the *options* and the *callback* parameter were optional but the *callback* had a higher precedence. You can do this quite easily with **deFunc** by nesting **deFunc** calls. 

Using the same *new_jQuery_like* function already defined, you can wrap it again using **deFunc** like this:

    var advanced_jQuery_like = deFunc(new_jQuery_like, 1, [default_fn]);

    advanced_jQuery_like("#id");					-> jQuery_like("#id", {default:options}, default_fn)
    advanced_jQuery_like("#id", fn);				-> jQuery_like("#id", {default:options},         fn)
    advanced_jQuery_like("#id", {new:options}, fn);	-> jQuery_like("#id", {new:options},             fn)

One thing to note: Even though the *callback* parameter is the third parameter in the original function (jQuery_like), when you wrapped it with **deFunc** it became the second **required** parameter. **deFunc** is only concerned with required parameters.

Initially, **deFunc** considers all of your functions parameters required. This means that when you go to wrap your function a second time, the position of arguments has changed because only required parameters are able to be **deFunc**'d. In fact, **deFunc** will throw an error if you try to pass more default options than there are required parameters remaining.
