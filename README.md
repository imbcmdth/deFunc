# deFunc v0.0.3

A powerful JavaScript helper function for specifying both required parameters and optional parameters with default values.

````javascript
wrapped = deFunc(wrappee, offset, defaults);
````

Where:

* **wrappee** A function to which you want to add **deFunc** functionality
* **offset** A number that represents the zero-based offset into *wrappee*'s parameters where the *defaults* begin
* **defaults** An array of default values for *wrappee*'s parameters

Parameters that are given default values become optional parameters. Otherwise, they become required parameters.

## Basic Usage

Let's say that you have a function with the signature:

    function([A, B, C])

**NOTE** *Square brackets are used in function signatures as a short-hand to denote optional parameters. You would **not** use them in actual JavaScript code.*

In this function, all the parameters are completely optional but you usually want to make sure that the parameters are all set to some some reasonable defaults if not provided by the caller. To do this you would use **deFunc** like this:

```javascript
var foo = function(A, B, C) { /* function body */ };

var bar = deFunc(foo, 0, ["a", "b", "c"]);

bar();					// -> foo(    "a",     "b",  "c")
bar("new_a");			// -> foo("new_a",     "b",  "c")
bar("new_a", "new_b");	// -> foo("new_a", "new_b",  "c")
````
Optional parameters are always filled in from left to right. To set *C*, you **must** first provide both *A* and *B*.

## More Usage

**deFunc** does not require that every function parameter is provided some default. Parameters without a default value automatically become *required* parameters.

Required parameters will throw a [ReferenceError](https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/ReferenceError) if they are not provided by the caller. With **deFunc** enforcing required parameters for you, your functions don't have to worry about getting "undefined" where it shouldn't be.

Say you wanted a function with this signature:

    function(A[, B[, C]])

Using the same *foo* function defined above you can change **deFunc**'s *offset* parameter to **1** and remove the first element ("a") from the array. Now, foo's first parameter, *A*, is required while both *B* and *C* remain optional:

```javascript
var bar = deFunc(foo, 1, ["b", "c"]);

bar();				// -> Throws a ReferenceError
bar("a'");			// -> foo("a'",      "b",  "c")
bar("a'", "new_b");	// -> foo("a'",  "new_b",  "c")
````

The real power of **deFunc** lies in **deFunc**'s *offset* parameter. If you change the *offset* back to **0** you can instead define parameters *A* and *B* as optional and make *C* the one that is required.

This small change results in a function with this signature:

    function([A, [B ,]] C)

As you can see by the way additional parameters are passed to *foo* below:

```javascript
var bar = deFunc(foo, 0, ["a", "b"]);

bar();				// -> Throws a ReferenceError
bar("c'");			// -> foo("a",      "b",  "c'")
bar("new_a", "c'");	// -> foo("new_a",  "b",  "c'")
````

## Parameter-Swizzling

jQuery, for example, has many functions with a signature similar to this:

    function(id[, options], callback)

Where the parameter *options* is completely optional but both *id* and *callback* are required. Usually, this means that immediately before the main body of code the function must have something like this:

```javascript
if(typeof callback === "undefined") {
    callback = options;
    options = default_options;
}
````

This is done in order to place the parameters back into the correct arguments and also set *options* to some reasonable default. I call this practice **parameter-swizzling** due to the similarities such a method has in common with [array swizzling](http://en.wikipedia.org/wiki/Swizzling_%28computer_graphics%29) used in GPU programming.

The problem is that **parameter swizzling** done in this way is error prone and it requires each of your functions to have a preamble that puts considerable distance between your function's definition and the real function body.

**deFunc** takes all the **parameter-swizzling** logic out of your functions so you can be sure that you always get *every* parameter in exactly the right locations along with default values filling in the parameters that are optional and were not provided by the caller.

To achieve the same result as the parameter-swizzling code shown above, you would simply use **deFunc** like this:

```javascript
var foo = function(id, options, callback) { /* function body */ };
var bar = deFunc(foo, 1, [{default:options}]);
````

This tells **deFunc** to take the "foo" function (which takes three parameters) and return a new function that takes two required parameters (*id* and *callback*) with a single optional parameter (*options*). 

**deFunc** takes care of the rest of the *parameter-swizzling* for you:

```javascript
bar("#id");						// -> Throws a ReferenceError
bar("#id", fn);					// -> foo("#id", {default:options}, fn)
bar("#id", {new:options}, fn);	// -> foo("#id", {new:options},     fn)
````

## Advanced Usage

Building on the example above, lets say that you wanted a function where both the *options* and the *callback* parameters were optional but the *callback* parameter had a higher precedence.

    function(id [[, option], callback])

You can do this quite easily with **deFunc** by nesting **deFunc** calls. Using the same *foo* function already defined, you can wrap it *twice* using **deFunc** like this:

```javascript
var foo = function(id, options, callback) { /* function body */ };
var baz = deFunc( deFunc(foo, 1, [{default:options}]), 1, [default_fn]);

baz("#id");						// -> foo("#id", {default:options}, default_fn)
baz("#id", fn);					// -> foo("#id", {default:options},         fn)
baz("#id", {new:options}, fn);	// -> foo("#id", {new:options},             fn)
````

## Explaining Advanced Usage

Even though the *callback* parameter is the third parameter in the original function (*foo*), when you wrapped *foo* with **deFunc**, *callback* became the second **required** parameter. **deFunc** is only concerned with required parameters.

That means when you go to wrap your function a second time, the *offset* has changed because only required parameters are able to be **deFunc**'d. In fact, **deFunc** will throw an error if you try to pass more *defaults* than there are required parameters remaining.

In order to visualize this process let's go step by step through the process of nesting **deFunc** calls and the results. Each function has the *offsets* explicitly shown below to help in understanding the process.

First, you start with:

    foo     (A, B, C)
    offsets  0  1  2     // Initially, all parameters are considered required

Then make offset 1 (B) optional with:

    bar = deFunc(foo, 1, [B's default value])

Which resulting in:

    bar     (A[, B], C) 
    offsets  0       1    // B no longer has an "offset" value because it has become optional

Then make offset 1 (C) optional with:

    baz = deFunc(bar, 1, [C's default value])

Which resulting in our final function:

    baz     (A[[, B], C])
    offsets  0            // Finally, only A has an "offset" value because it's the only remaining required parameter

I hope that helps!

## Change History

0.0.3 - Fixed deFunc-wrapped functions not returning values
0.0.2 - Rewrote deFunc to make it more flexible and powerful
0.0.1 - Initial release