# Formwatcher Version 0.0.5

The formwatcher is a tool to easily improve forms with JavaScript with following goals in mind:

- Be completely unobtrusive (your forms still work without JS)
- Provide sensible defaults so you won't have to configure much
- Provide the best user experience possible

It is written in [CoffeeScript][] and built with (and depends on):

  - [domready][]
  - [qwery][] (Selector Engine)
  - [bonzo][] (DOM utility)
  - [bean][] (Event utility)
  - [superagent][] (AJAX utility)

[domready]: https://github.com/ded/domready
[qwery]: https://github.com/ded/qwery
[bonzo]: https://github.com/ded/bonzo
[bean]: https://github.com/fat/bean
[superagent]: http://visionmedia.github.com/superagent/

[coffeescript]: http://coffeescript.org/


Visit the [official site](http://www.formwatcher.org/) for a demo.


## Installation

Simply install with [component](https://github.com/component/component):

    component install formwatcher/formwatcher

and include it in your source:

```javascript
!function() {
  var Formwatcher = require("formwatcher");

  // Require any additional formwatcher components here, like:
  require("validators");
  require("hint");

  // Optionally let Formwatcher discover all forms that have a `data-fw` field:
  Formwatcher.discover();
}()
```

## Features

The **features** include:

- AJAX conversion: Turn a form into an AJAX call automatically
- Automatically add `.focus`, `.changed`, `.validated`, `.error`, `.empty`, etc... classes to input fields
- Lots of built in validators, and the possibilty to write your own
- Decorators: Turn a simple select input field into an image selector, or a font selector or display a nice hint
- Simple html attribute configuration that is W3C valid, either by setting classes on the input field, or using the `data-fw` attribute.
- Automatching of `<label>` elements so you don't have to write the `for=""` attribute.
- ...and more

Formwatcher is tested with qunit and works in Safari, Chrome, Firefox, Opera and IE7+.


## Formwatcher components

Those are the components that can already exist and can be used with formwatcher:

- [`formwatcher/validators`](https://github.com/formwatcher/validators) Basic validators for floats, integers, etc...
- [`formwatcher/hint`](https://github.com/formwatcher/hint) Shows nice hints that fade out when the input field is focused.
- [`formwatcher/dropdown`](https://github.com/formwatcher/dropdown) Converts select fields to nice dropdowns.
- *more coming soon...*

Simply add them in your `component.json` file.



## Configuration

You can configure formwatcher [imperatively](#imperative-configuration) or by
[defining specific html attributes](#attribute-configuration) on your form


### Imperative configuration

Although most of the time, the simplest way to configure Formwatcher is by
[attribute configuration](#attribute-configuration), there are a few use cases
where the imperative configuration is necessary or more appropriate:

    Formwatcher.watch('form-id');


### Attribute configuration

Instead of configuring your forms with JS, you can simply add the `data-fw`
attribute to your elements so Formwatcher knows how to handle them. The best
part about it: _it doesn't break your HTML markup_; it still validates fine.


    <form action="" data-fw="">
      <!-- Input fields -->
    </form>

When Formwatcher is included, it will scan all forms in the document as soon as
it's loaded to see if there is any form with the `data-fw` attribute, and attaches
itself to it.

The `data-fw` attribute is just a JSON object, that will be passed to the new
`Watcher` instance and serves as `options` object.

A Formwatcher configuration could look like this:

    <form action="" data-fw='{ "ajax": true, "validate": false }'>
    </form>

> __NOTE:__ The `data-fw` content is pure JSON. All names and strings have to be
> in double quotes, so you have to put the `data-fw` value itself in single quotes.

Since it's JSON, not JS, you won't be able to directly define your callback
functions here.

You can directly configure decorators or validators inside this JSON object:

    <form action="" data-fw='{
      "validate": true,
      "Hint": { "auto": true },
      "Float": { "decimalMark": "," }
    }'>
    </form>


## Writing your own Validators

Writing validators is very easy. A validator is a class that gets an `options`
object and a `Watcher` instance in the constructor. The instance must have the
field `name` and respond to the methods `accepts`, `validate`  and `format`.

You can also optionally provide a `description`.

To activate a validator it has to be pushed onto the `Formwatcher.validators`
array.

A simple JavaScript implementation could look like this:

```javascript
function myValidator(options, watcher) {
  this.options = options;
  this.watcher = watcher;
}

myValidator.prototype.name = "only-helloworld";

myValidator.prototype.description = "Makes sure the content is only 'Hello world'.";

myValidator.prototype.accepts = function(input) {
  return input.className.indexOf("validate-only-hello-world") != -1;
};

/**
 * Returns an error string on error, or true on success.
 */
myValidator.prototype.validate = function(value, input) {
  if (value === "Hello world") return true
  return "Did not contain hello world!";
};

myValidator.prototype.format = function(value) {
  return value.toUpperCase();
};

require("formwatcher").push(myValidator);

```

If you write your validator in coffeescript you can benefit from the
`Formwatcher.Validator` class by simply extending it and overwrite your
functions. Please look at the source to see how it works.


You should then add a `component.json` to your repository so it can be included properly.

Don't forget to `require` it so it is «activated»:

```javascript
require("only-helloworld");
```

## Writing your own Decorators


Writing decorators is a bit more complex, but not difficult neither.
The basic concept is again pushing classes to `Formwatcher.decorators`.

Decorators look like validators but instead of `validate()` and `format()`
functions they have a `decorate()` function that has to return an object with
all fields that have been generated and that should be updated with `.focus`,
`.validated`, etc... classes.
The object return **must** at least have an `input` field with the InputElement
that holds the actual value to validate and submit. But it can be a new hidden
field in case your decorator completely rebuilds the input.


```javascript

myDecorator.prototype.decorate = function(input) {
  var elements = { input: input };

  // Here is your code to nicely wrap (or replace) the input field.

  return elements
};
```

Again, formwatcher provides a nice `Formwatcher.Decorator` class you can extend
if you're writing your code in Coffeeescript.

Take a look at the [hint decorator](https://github.com/formwatcher/hint) for a full example.


