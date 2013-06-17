[![Build Status](https://travis-ci.org/opitzconsulting/angular-jqm.png)](https://travis-ci.org/opitzconsulting/angular-jqm)
#Angular-JQM

##Description
Native AngularJS directives for jQuery Mobile. Small footprint, no 3rd party JS dependencies (jQuery, jQuery Mobile JS) required!


##Why

- Download size: If you want to use the JavaScript part of jqm, you also need to use jquery.
  In total you need angular, jquery, jqm and the adapter. A lot of stuff...
- Performance: The original jqm widgets not always do things the most performant way.
  E.g. they use a lot of css selector queries. Furthermore, they usually only have one `refresh` method
  to refresh to whole widget (e.g. a `listview`), but not parts of it.
- Maintainability: Using the jqm JavaScript part requires some dirty hacks so that it works with angular.
  However, to maintain those hacks you need a lot of knowledge about the internas of jqm and angular.

This is very similar to the angular bootstrap integration: There is an adapter that uses 
the JavaScript part of bootstrap, angular-strap (http://mgcrea.github.io/angular-strap/), and another version
that uses the boostrap css only from the angular-ui team (http://angular-ui.github.io/bootstrap/).

To ensure that our directives work correctly we create special tests that compare the
generated markup of our directives with the markup generated by plain jquery mobile. By this it should
also be easy to keep track of changes in jquery mobile when they release newer versions.

## Build
Directory structure

- dist: The compiled versions of the adapter (ignored during branch merges)
- src: The source files of the adapter
- test/unit: The unit tests

Commits:

- Commit messages must follow the conventions [here](https://github.com/btford/grunt-conventional-changelog)

Commands:

- Install the dependencies: `npm install` and then `./node_modules/.bin/bower install`.
- Build it: `grunt`
- Auto-Run tests when file change: `grunt dev`

(this needs grunt-cli installed globally: `npm install grunt-cli -g`)

Add source files:

1. add the file to the `src` folder
2. add an entry in `build/files.js` at the right position.

Tests:

- for all source files we have unit tests
- for all directives, we additionally have tests that compare the markup with the real jqm widgets.
- unit tests may access every private function in `jqm-angular`:

    For the whole build, we are using an immediately executing function expression to ensure that
no variable leaks into the global scope. However, when running the unit tests we include the source files without that protection.
    Note: The same principle is used by angular for it's sources and unit tests.

## Getting started

Your main html file should look like this:

    <!DOCTYPE html>
    <html ng-app="app">
    <head>
        <link type="text/css" rel="stylesheet" href="jquery.mobile-1.3.1.css">
        <script src="angular.js"></script>
        <script src="angular-jqm.js"></script>
        <!-- include your application script files here -->
        <script src="app.js"></script>
    </head>

    <body jqm-viewport>

    </body>

    </html>

Inside your application scripts, define a new module that depends on the module `jqm` and setup routes
for all pages that you want to display. E.g.:

    var mod = angular.module('app', ['jqm']);
    mod.config(function($routeProvider) {
        // A route for a single page
        $routeProvider.when("/", {
            redirectTo: "main.html"
        });
        // A route for all pages in one folder
        $routeProvider.when("/:page", {
            transition: 'slide',
            templateUrl: function(params) {
                return params.page;
            }
        });
    });

## Docs
The docs can be found here: [doc/index.html](https://rawgithub.com/opitzconsulting/angular-jqm/master/doc/index.html).
