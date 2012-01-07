# Andro.js

* by mary rose cook
* http://maryrosecook.com
* maryrosecook@maryrosecook.com

Mix behaviours into objects.

## What is Andro.js?

Andro.js takes mixins and applies them, each in their own namespace, to an object, and lets them talk to one other via an event emitter.

## Come again?

Imagine a cube.  It can be touched.  You want it to make a sound when it goes from not being touched to being touched.  You write a little behaviour that emits an event when a first touch occurs.  You write another little behaviour that plays a sound when it receives a first touch event.  You combine these behaviours on your cube with Andro.js.

## Getting started

Download the repository.  Open `index.html` in your browser to see the documentation and an example.

## Running the tests

Install Node.js and npm.  Then install the node dependencies with:

    $ cd path/to/androjs
    $ npm install

Finally, run the tests with:

    $ node_modules/jasmine-node/bin/jasmine-node spec/

## Licence

Andro.js is open source, under the MIT licence.



