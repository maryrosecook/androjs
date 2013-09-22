# Andro.js

* by mary rose cook
* http://maryrosecook.com
* maryrosecook@maryrosecook.com

Mix behaviours into objects.

## What is Andro.js?

Andro.js takes mixins and applies them, each in its own namespace, to an object, and lets them talk to one another via an event emitter.

## Come again?

Imagine a cube.  It can be touched.  You want it to make a sound when it goes from not being touched to being touched.  You write a little behaviour that emits an event when a first touch occurs.  You write another little behaviour that plays a sound when it receives a first touch event.  You combine these behaviours on your cube with Andro.js.

## Get the code

* Minified: https://raw.github.com/maryrosecook/androjs/master/andro-min.js
* Single file: https://raw.github.com/maryrosecook/androjs/master/andro.js
* GitHub: https://github.com/maryrosecook/androjs
* npm: `$ npm install androjs`

## Get started

Download the repository.  Require the `andro.js` file in your code.  Open `index.html` in your browser to see the documentation and an example.

## Run the tests

Install Node.js and npm.

Install the node dependencies

    $ cd path/to/androjs
    $ npm install

Run the tests

    $ cd path/to/androjs
    $ npm test

## Licence

Andro.js is open source, under the MIT licence.
